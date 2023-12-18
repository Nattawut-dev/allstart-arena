import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { getToken } from 'next-auth/jwt';

export default async function insertData(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const token = await getToken({ req })
        if (!token) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const { level, listT_id } = req.query
        if (level || listT_id) {
            const connection = await pool.getConnection()
            try {
                const query = `SELECT * FROM tournament WHERE level = ? AND listT_id = ? `;
                // Execute the SQL query to fetch time slots
                const [results] = await connection.query(query, [level, listT_id]);
                res.json(results);
            } catch (error) {
                console.error('Error fetching lisTournament:', error);
                res.status(500).json({ error: 'Error fetching lisTournament' });
            } finally {
                connection.release();
            }
        }

    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
