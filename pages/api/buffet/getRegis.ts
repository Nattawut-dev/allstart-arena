import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { format, utcToZonedTime } from 'date-fns-tz';



export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {

        const connection = await pool.getConnection()
        try {
            const dateInBangkok = utcToZonedTime(new Date(), "Asia/Bangkok");
            const usedate = format(dateInBangkok, 'dd MMMM yyyy')
            const query = `SELECT buffet.id , buffet.name, buffet.nickname, buffet.usedate, buffet.price, buffet.shuttle_cock, buffet.paymentStatus ,buffet.q_list ,buffet.q_id, 
        CASE 
            WHEN current_buffet_q.id IS NULL THEN NULL
            ELSE current_buffet_q.T_value
        END AS T_value
 FROM buffet
 LEFT JOIN current_buffet_q ON buffet.q_id = current_buffet_q.id 
 WHERE buffet.usedate = ?  AND buffet.paymethod_shuttlecock = '' AND buffet.paymentStatus = 1  ORDER BY buffet.id DESC ;`;
            // Execute the SQL query to fetch time slots
            const [results] = await connection.query(query, [usedate]);

            res.json(results);
        } catch (error) {
            console.error('Error fetching time slots:', error);
            res.status(500).json({ error: 'Error fetching time slots' });
        } finally {
            connection.release(); // Release the connection back to the pool when done
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};
