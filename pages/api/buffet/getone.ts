import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { format, utcToZonedTime } from 'date-fns-tz';


export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const connection = await pool.getConnection()
    try {
        const {id} = req.query
        const query = 'SELECT id, nickname, usedate, price, shuttle_cock, paymentStatus, regisDate FROM buffet WHERE id = ? ';

        // Execute the SQL query to fetch time slots
        const [results] = await connection.query(query, [id]);
        res.json(results);
    } catch (error) {
        console.error('Error fetching :', error);
        res.status(500).json({ error: 'Error fetching ' });
    } finally {
        connection.release(); // Release the connection back to the pool when done
    }
};
