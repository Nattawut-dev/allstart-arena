import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { getToken } from 'next-auth/jwt';

export default async function insertData(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        // Get the session token from the request cookies
        const token = await getToken({ req })
        if (!token) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const connection = await pool.getConnection()
        try {
            const query = `SELECT * FROM listtournament ORDER BY id DESC`;

            // Execute the SQL query to fetch time slots
            const [results] = await connection.query(query);
            res.json(results);
        } catch (error) {
            console.error('Error fetching lisTournament:', error);
            res.status(500).json({ error: 'Error fetching lisTournament' });
        } finally {
            connection.release(); // Release the connection back to the pool when done
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
