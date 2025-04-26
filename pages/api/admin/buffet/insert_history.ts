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
    const connection = await pool.getConnection();
    try {
        const dateInBangkok = utcToZonedTime(new Date(), "Asia/Bangkok");
        const usedate = format(dateInBangkok, 'dd MMMM yyyy');
        const currentTime = format(dateInBangkok, 'HH:mm:ss'); 

        const destinationItems = req.body;
        let { shuttle_cock, court, shuttlecock_type_id } = req.query;

        if (shuttle_cock == '') { shuttle_cock = '-' }
        if (court == '') { court = '-' }
        let queries = `
            INSERT INTO history_buffet (
                player1_id, player2_id, player3_id, player4_id, 
                shuttle_cock, court, usedate, time, shuttlecock_type_id
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        const [results] = await connection.query(queries, [
            destinationItems[0]?.id ?? null,
            destinationItems[1]?.id ?? null,
            destinationItems[2]?.id ?? null,
            destinationItems[3]?.id ?? null,
            shuttle_cock,
            court,
            usedate,
            currentTime,
            shuttlecock_type_id ?? null
        ]);
        
        res.json(results);
    } catch (error) {
        console.error('Error inserting history_buffet:', error);
        res.status(500).json({ error: 'Error inserting history_buffet' });
    } finally {
        connection.release();
    }
}
else if (req.method === 'GET') {
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
            s.short_name AS shuttlecock_short_name,
            s.full_name AS shuttlecock_full_name,
            s.price AS shuttlecock_price

        FROM 
            history_buffet h
        LEFT JOIN buffet b1 ON h.player1_id = b1.id
        LEFT JOIN buffet b2 ON h.player2_id = b2.id
        LEFT JOIN buffet b3 ON h.player3_id = b3.id
        LEFT JOIN buffet b4 ON h.player4_id = b4.id
        LEFT JOIN shuttlecock_types s ON h.shuttlecock_type_id = s.id
        WHERE 
            h.usedate = ?
        ORDER BY 
            h.id DESC;`;

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
