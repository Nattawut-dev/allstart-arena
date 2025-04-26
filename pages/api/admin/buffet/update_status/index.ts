import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { getToken } from 'next-auth/jwt';
import { customerPaymentStatusEnum } from '@/enum/customerPaymentStatusEnum';
import { buffetStatusEnum } from '@/enum/buffetStatusEnum';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { paymentStatusEnum } from '@/enum/paymentStatusEnum';
import { PayByEnum } from '@/enum/payByEnum';
import { buffetPaymentStatusEnum } from '@/enum/buffetPaymentStatusEnum';


export default async function insertData(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        const token = await getToken({ req })
        if (!token) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const connection = await pool.getConnection()
        try {
            const { id, status, customerPaymentStatus } = req.body
            const query = `UPDATE buffet SET paymentStatus = ? WHERE id = ?;`;

            const [results] = await connection.query(query, [status, id]);

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

            const selectPayDateQuery = `(
                        SELECT STR_TO_DATE(b.pay_date, '%d %M %Y')
                        FROM buffet b 
                        WHERE b.id = ${id}
                    )`
            if (salesData && salesData[0].count !== 0) {
                const query = `
                UPDATE pos_sales 
                SET 
                    PaymentStatus = ?,
                    pay_by = ?,
                    pay_date = ${customerPaymentStatus === customerPaymentStatusEnum.PAID ? selectPayDateQuery : 'null'}
                WHERE CustomerID = (
                    SELECT pc.customerID 
                    FROM pos_customers pc 
                    WHERE pc.playerId = ? 
                    AND pc.buffetStatus = ?
                )
            `;

                await connection.execute<ResultSetHeader>(query, [
                    paymentStatusEnum.Paid,
                    PayByEnum.TRANSFER,
                    id,
                    buffetStatusEnum.BUFFET
                ]);

            }

            // Using a derived table to avoid the MySQL error of referencing the same table in UPDATE and FROM
            await connection.query(`
                UPDATE pos_customers
                SET 
                    paymentStatus = ?,
                    pay_by = ?,
                    pay_date = ${customerPaymentStatus === customerPaymentStatusEnum.PAID ? selectPayDateQuery : 'null'}
                WHERE customerID = (
                    SELECT customerID FROM (
                        SELECT pc.customerID 
                        FROM pos_customers pc 
                        WHERE pc.playerId = ? 
                        AND pc.buffetStatus = ?
                        LIMIT 1
                    ) AS temp
                )
            `, [customerPaymentStatus, PayByEnum.TRANSFER, id, buffetStatusEnum.BUFFET]);

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
