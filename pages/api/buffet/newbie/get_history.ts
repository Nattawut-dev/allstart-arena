import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { format, utcToZonedTime } from 'date-fns-tz';



export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {
        const connection = await pool.getConnection()
        try {
            const dateInBangkok = utcToZonedTime(new Date(), "Asia/Bangkok");
            const usedate = format(dateInBangkok, 'dd MMMM yyyy')
            let queries = `
            SELECT 
                b1.nickname AS player1_nickname,
                b2.nickname AS player2_nickname,
                b3.nickname AS player3_nickname,
                b4.nickname AS player4_nickname,
                h.shuttle_cock,
                h.court,
                h.time,
                s.code AS shuttlecock_code
            FROM 
                history_buffet_newbie h
            LEFT JOIN buffet_newbie b1 ON h.player1_id = b1.id
            LEFT JOIN buffet_newbie b2 ON h.player2_id = b2.id
            LEFT JOIN buffet_newbie b3 ON h.player3_id = b3.id
            LEFT JOIN buffet_newbie b4 ON h.player4_id = b4.id
            LEFT JOIN shuttlecock_types s ON h.shuttlecock_type_id = s.id
            WHERE 
                h.usedate = ?
            ORDER BY 
                h.id DESC;`;
            // Execute the SQL query to fetch time slots
            const [results] = await connection.query(queries, [usedate]);

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
