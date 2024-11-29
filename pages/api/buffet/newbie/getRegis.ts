import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { format, utcToZonedTime } from 'date-fns-tz';



export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {

        const connection = await pool.getConnection()
        try {
            const dateInBangkok = utcToZonedTime(new Date(), "Asia/Bangkok");
            const usedate = format(dateInBangkok, 'dd MMMM yyyy')
            const query = `SELECT buffet_newbie.id , buffet_newbie.nickname, buffet_newbie.usedate, buffet_newbie.price, buffet_newbie.shuttle_cock, buffet_newbie.paymentStatus ,buffet_newbie.q_list ,buffet_newbie.q_id , buffet_newbie.couterPlay ,  buffet_newbie.isStudent , buffet_newbie.skillLevel,
        CASE 
            WHEN current_buffet_q.id IS NULL THEN NULL
            ELSE current_buffet_q.T_value
        END AS T_value
            FROM buffet_newbie
            LEFT JOIN current_buffet_q ON buffet_newbie.q_id = current_buffet_q.id 
            WHERE buffet_newbie.usedate = ?  AND buffet_newbie.paymethod_shuttlecock = '0' AND paymentStatus = 0  `;
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
