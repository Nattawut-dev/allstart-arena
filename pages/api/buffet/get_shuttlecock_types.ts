import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const connection = await pool.getConnection();
        try {
            const query = `
                SELECT 
                    id,
                    code,
                    name,
                    price
                FROM 
                    shuttlecock_types
                WHERE 
                    isActive = true
                ORDER BY 
                    id ASC;
            `;
            const [results] = await connection.query(query);
            res.status(200).json(results);
        } catch (error) {
            console.error('Error fetching shuttlecock types:', error);
            res.status(500).json({ message: 'Error fetching shuttlecock types' });
        } finally {
            connection.release();
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
