import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { getToken } from 'next-auth/jwt';


export default async function get(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const token = await getToken({ req })
        if (!token) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const { search } = req.query;
        const connection = await pool.getConnection()

        try {
            const query = search === undefined ? 'SELECT  * FROM pt_reserve ORDER BY id DESC LIMIT 1000 ' :
                'SELECT  * FROM pt_reserve WHERE name LIKE ? OR phone LIKE ? OR usedate LIKE ? ORDER BY id DESC LIMIT 1000 '

            // Execute the SQL query to fetch time slots
            const [results] = await connection.query(query, [`%${search}%`, `%${search}%`, `%${search}%`]);
            res.json(results);
        } catch (error) {
            console.error('Error fetching pt_reserve:', error);
            res.status(500).json({ error: 'Error fetching pt_reserve' });
        } finally {
            connection.release(); // Release the connection back to the pool when done
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
