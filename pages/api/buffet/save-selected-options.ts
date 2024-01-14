import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';


export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const connection = await pool.getConnection()
    try {
        const sql = 'SELECT selected_options FROM current_cock ';

        const [results] = await connection.query(sql )
        res.json(results);
    } catch (error) {
        console.error('Error fetching :', error);
        res.status(500).json({ error: 'Error fetching ' });
    } finally {
        connection.release(); // Release the connection back to the pool when done
    }
};
