import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { getToken } from 'next-auth/jwt';
import { format, utcToZonedTime } from 'date-fns-tz';


export default async function insertData(req: NextApiRequest, res: NextApiResponse) {
    const token = await getToken({ req })
    if (!token) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
    }
    else if (req.method === 'PUT') {

        const connection = await pool.getConnection()
        try {
  
            const query = `UPDATE buffet_newbie SET  nickname = ?, phone = ?, shuttle_cock = ?, price = ? , usedate = ? , paymethod_shuttlecock = ? , paymentStatus = ? , pay_date = ? , isStudent = ? WHERE id = ?`;
            const { id, nickname, phone, shuttle_cock, price, usedate , paymethod_shuttlecock ,pay_date , isStudent} = req.body;
            const payment_status = paymethod_shuttlecock != '0' && paymethod_shuttlecock != '4'? 2 : 0
            const payment_date = paymethod_shuttlecock != '0' ? pay_date : null

            const [results] = await connection.query(query, [nickname, phone, shuttle_cock, price, usedate, paymethod_shuttlecock  , payment_status,payment_date , isStudent,  id]);
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
