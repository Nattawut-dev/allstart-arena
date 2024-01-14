import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { format, utcToZonedTime } from 'date-fns-tz';
import { getToken } from 'next-auth/jwt';



export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const token = await getToken({ req })
        if (!token) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const connection = await pool.getConnection()
        try {
            const dateInBangkok = utcToZonedTime(new Date(), "Asia/Bangkok");
            const usedate = format(dateInBangkok, 'dd MMMM yyyy')
            const query = `SELECT buffet.*, 
            CASE 
                WHEN current_buffet_q.id IS NULL THEN NULL
                ELSE current_buffet_q.T_value
            END AS T_value,
            buffet_setting.shuttle_cock_price,
            buffet_setting.court_price
        FROM buffet
        LEFT JOIN current_buffet_q ON buffet.q_id = current_buffet_q.id 
        LEFT JOIN buffet_setting ON buffet_setting.id = 1
        WHERE buffet.usedate = ?  AND buffet.paymethod_shuttlecock = '0' AND paymentStatus = 0 `;


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
