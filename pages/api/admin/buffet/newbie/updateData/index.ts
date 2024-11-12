import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { getToken } from 'next-auth/jwt';
import { format, utcToZonedTime } from 'date-fns-tz';
import { PaymethodShuttlecockEnum } from '@/enum/paymethodShuttlecockEnum';
import { buffetPaymentStatusEnum } from '@/enum/buffetPaymentStatusEnum';
import { buffetStatusEnum } from '@/enum/buffetStatusEnum';
import { customerPaymentStatusEnum } from '@/enum/customerPaymentStatusEnum';
import { PayByEnum } from '@/enum/payByEnum';


export default async function insertData(req: NextApiRequest, res: NextApiResponse) {
    const token = await getToken({ req })
    if (!token) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
    }
    else if (req.method === 'PUT') {

        const connection = await pool.getConnection()
        try {

            const query = `UPDATE buffet_newbie SET  nickname = ?, phone = ?, shuttle_cock = ?, price = ? , usedate = ? , pay_date = ? , isStudent = ? WHERE id = ?`;
            const { id, nickname, phone, shuttle_cock, price, usedate, paymethod_shuttlecock, pay_date, isStudent } = req.body;
            // const payment_status = paymethod_shuttlecock != PaymethodShuttlecockEnum.NONE && paymethod_shuttlecock != PaymethodShuttlecockEnum.FINISH_PLAY ? buffetPaymentStatusEnum.PAID : buffetPaymentStatusEnum.PENDING;
            const totalPrice = paymethod_shuttlecock != PaymethodShuttlecockEnum.NONE && paymethod_shuttlecock != PaymethodShuttlecockEnum.FINISH_PLAY ? price : null;

            // const pay_by = () => {
                
            //     switch (paymethod_shuttlecock) {
            //         case PaymethodShuttlecockEnum.NONE:
            //             return null
            //         case PaymethodShuttlecockEnum.CASH_ADMIN:
            //             return PayByEnum.CASH
            //         case PaymethodShuttlecockEnum.TRANSFER_ADMIN:
            //             return PayByEnum.TRANSFER
            //         case PaymethodShuttlecockEnum.TRANSFER_CUSTOMER:
            //             return PayByEnum.TRANSFER
            //         case PaymethodShuttlecockEnum.FINISH_PLAY:
            //             return null
            //         default:
            //             return null
            //     }
            // }

            // const customerPaymentStatus = () => {
            //     switch (paymethod_shuttlecock) {
            //         case PaymethodShuttlecockEnum.NONE:
            //             return null
            //         case PaymethodShuttlecockEnum.CASH_ADMIN:
            //             return customerPaymentStatusEnum.PAID
            //         case PaymethodShuttlecockEnum.TRANSFER_ADMIN:
            //             return customerPaymentStatusEnum.PAID
            //         case PaymethodShuttlecockEnum.TRANSFER_CUSTOMER:
            //             return customerPaymentStatusEnum.PAID
            //         case PaymethodShuttlecockEnum.FINISH_PLAY:
            //             return null
            //         default:
            //             return null
            //     }
            // }


            // await connection.query(`
            //     UPDATE pos_customers 
            //     SET paymentStatus = ?,
            //         pay_by = ?,
            //         courtPrice = ?
            //     WHERE customerID = (
            //         SELECT pc.customerID 
            //         FROM pos_customers pc 
            //         WHERE pc.playerId = ? 
            //         AND pc.buffetStatus = '${buffetStatusEnum.BUFFET_NEWBIE}'
            //     )
            // `, [customerPaymentStatus(), pay_by(), price, id]);
            
            const payment_date = paymethod_shuttlecock != PaymethodShuttlecockEnum.NONE ? pay_date : null

            const [results] = await connection.query(query, [nickname, phone, shuttle_cock, totalPrice, usedate, pay_date, isStudent, id]);
            res.json({ results });
        } catch (error) {
            console.error('Error :', error);
            res.status(500).json({ error: 'Error ' });
        } finally {
            connection.release(); // Release the connection back to the pool when done
        }
    } else if (req.method === 'DELETE') {
        const connection = await pool.getConnection()
        try {

            const query = `DELETE FROM buffet_newbie WHERE id = ?`;
            const { id } = req.query;
            const [results] = await connection.query(query, [id]);
            res.json({ results });
        } catch (error) {
            console.error('Error :', error);
            res.status(500).json({ error: 'Error ' });
        } finally {
            connection.release(); // Release the connection back to the pool when done
        }
    }
    else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
