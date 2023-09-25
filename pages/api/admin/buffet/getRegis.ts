import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { format, utcToZonedTime } from 'date-fns-tz';


export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        // Get the session token from the request cookies
        const sessionToken = req.cookies.sessionToken;

        if (!sessionToken) {
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
        END AS T_value
 FROM buffet
 LEFT JOIN current_buffet_q ON buffet.q_id = current_buffet_q.id 
         WHERE buffet.usedate = ?  ORDER BY buffet.id DESC ;`;

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
