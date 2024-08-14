import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { getToken } from 'next-auth/jwt';
import { format, utcToZonedTime } from 'date-fns-tz';
import { buffetPaymentStatusEnum } from '@/enum/buffetPaymentStatusEnum';
import { buffetStatusEnum } from '@/enum/buffetStatusEnum';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { paymentStatusEnum } from '@/enum/paymentStatusEnum';
import { customerPaymentStatusEnum } from '@/enum/customerPaymentStatusEnum';


export default async function insertData(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        const token = await getToken({ req })
        if (!token) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const connection = await pool.getConnection()
        try {
            const dateInBangkok = utcToZonedTime(new Date(), "Asia/Bangkok");
            const today = format(dateInBangkok, 'dd MMMM yyyy')
            const query = `UPDATE buffet SET paymethod_shuttlecock = ?,price = ? , pay_date= ? ,paymentStatus = ${buffetPaymentStatusEnum.PAID} WHERE id = ?;`;
            const { id, paymethodShuttlecock, total_shuttle_cock_price } = req.body
            const [results] = await connection.query(query, [paymethodShuttlecock, total_shuttle_cock_price, today, id]);

            const saleDataQuery = `
            SELECT COUNT(*) as count 
            FROM pos_sales 
            WHERE CustomerID = (
                SELECT pc.customerID 
                FROM pos_customers pc 
                WHERE pc.playerId = ? AND pc.buffetStatus = '${buffetStatusEnum.BUFFET}'
            )
        `;
            const [salesData] = await connection.query<RowDataPacket[]>(saleDataQuery, [id]);

            if (salesData && salesData[0].count !== 0) {
                const query = `
                UPDATE pos_sales 
                SET PaymentStatus = ? 
                WHERE CustomerID = (
                    SELECT pc.customerID 
                    FROM pos_customers pc 
                    WHERE pc.playerId = ? AND pc.buffetStatus = '${buffetStatusEnum.BUFFET}'
                )
            `;

                await connection.execute<ResultSetHeader>(query, [
                    paymentStatusEnum.Paid,
                    id
                ]);
            }

            await connection.query(`
                UPDATE pos_customers
                SET paymentStatus = ?
                WHERE customerID = (SELECT pc.customerID FROM pos_customers pc WHERE pc.playerId = ? AND pc.buffetStatus = '${buffetStatusEnum.BUFFET}')
            `, [customerPaymentStatusEnum.PAID, id]);


            res.json({ results });
        } catch (error) {
            console.error('Error fetching holidays:', error);
            res.status(500).json({ error: 'Error fetching holidays' });
        } finally {
            connection.release(); // Release the connection back to the pool when done
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
