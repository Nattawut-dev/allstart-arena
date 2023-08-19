import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const { search } = req.query;
            const connection = await pool.getConnection();

            let query = 'SELECT * FROM reserve';
            const queryParams = [];

            if (search) {
                query += ' WHERE name LIKE ? OR phone LIKE ?';
                queryParams.push(`%${search}%`, `%${search}%`);
            }

            query += ' ORDER BY id DESC';

            const [results] = await connection.query(query, queryParams);
            return res.status(201).json(results);
        } catch (error) {
            console.error('Error fetching reserve history:', error);
            res.status(500).json({ error: 'Error fetching reserve history' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
