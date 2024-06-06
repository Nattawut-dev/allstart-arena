import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { getToken } from 'next-auth/jwt';

export default async function get(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        // Get the session token from the request cookies
        const token = await getToken({ req })
        if (!token) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const { status, page } = req.query
        const connection = await pool.getConnection()
        const maxGet = parseInt(page as string) * 20

        try {
            const query = status === '2' ? 'SELECT * FROM pt_reserve WHERE status = ? ORDER BY id DESC LIMIT 20 OFFSET ?;' : 'SELECT * FROM pt_reserve WHERE status = ?'

            // Execute the SQL query to fetch time slots
            const [results] = await connection.query(query, [status, maxGet]);
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
