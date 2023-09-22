import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { format, utcToZonedTime } from 'date-fns-tz';


export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const connection = await pool.getConnection()
    try {
        const dateInBangkok = utcToZonedTime(new Date(), "Asia/Bangkok");
        const usedate = format(dateInBangkok, 'dd MMMM yyyy')
        const query = 'SELECT * FROM buffet ';

        // Execute the SQL query to fetch time slots
        const [results] = await connection.query(query, [usedate]);
        res.json(results);
    } catch (error) {
        console.error('Error fetching time slots:', error);
        res.status(500).json({ error: 'Error fetching time slots' });
    } finally {
        connection.release(); // Release the connection back to the pool when done
    }
};
