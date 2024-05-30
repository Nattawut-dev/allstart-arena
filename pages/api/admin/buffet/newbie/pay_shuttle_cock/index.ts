import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { getToken } from 'next-auth/jwt';
import { format, utcToZonedTime } from 'date-fns-tz';


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
            const query = 'UPDATE buffet_newbie SET paymethod_shuttlecock = ?,price = ? , pay_date= ? ,paymentStatus = 2 WHERE id = ?;';
            const { id, method ,total_shuttle_cock_price} = req.body
            const [results] = await connection.query(query, [method, total_shuttle_cock_price , today, id]);
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
