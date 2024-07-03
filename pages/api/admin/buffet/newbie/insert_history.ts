import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { getToken } from 'next-auth/jwt';
import { format, utcToZonedTime } from 'date-fns-tz';



export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    const token = await getToken({ req })
    if (!token) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
    }
    if (req.method === 'POST') {

        const connection = await pool.getConnection()
        try {
            const dateInBangkok = utcToZonedTime(new Date(), "Asia/Bangkok");
            const usedate = format(dateInBangkok, 'dd MMMM yyyy')
            const currentTime = format(dateInBangkok, 'HH:mm:ss'); 

            const destinationItems = req.body;
            let { shuttle_cock, court } = req.query;
            if (shuttle_cock == '') { shuttle_cock = '-' }
            if (court == '') { court = '-' }

            let queries = `INSERT INTO history_buffet_newbie (player1_id, player2_id, player3_id, player4_id  , shuttle_cock , court , usedate , time)
            VALUES (?, ?, ?, ? , ? , ? , ? , ?);`;


            // Execute the SQL query to fetch time slots
            const [results] = await connection.query(queries, [destinationItems[0].id, destinationItems[1].id, destinationItems[2].id, destinationItems[3].id, shuttle_cock, court, usedate ,currentTime]);

            res.json(results);
        } catch (error) {
            console.error('Error fetching time slots:', error);
            res.status(500).json({ error: 'Error fetching time slots' });
        } finally {
            connection.release(); // Release the connection back to the pool when done
        }
    } else if (req.method === 'GET') {
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
                h.time

            FROM 
                history_buffet_newbie h
            LEFT JOIN 
                buffet_newbie b1 ON h.player1_id = b1.id
            LEFT JOIN 
                buffet_newbie b2 ON h.player2_id = b2.id
            LEFT JOIN 
                buffet_newbie b3 ON h.player3_id = b3.id
            LEFT JOIN 
                buffet_newbie b4 ON h.player4_id = b4.id
            WHERE 
                h.usedate = ?
            ORDER BY 
                h.id DESC; `;
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
