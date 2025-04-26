import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { getToken } from 'next-auth/jwt';

export default async function insertData(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        const token = await getToken({ req });
        if (!token) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }

        const connection = await pool.getConnection();
        try {
            const { id, shuttlecock_type_id, quantity } = req.body;

            const query = `
                INSERT INTO buffet_newbie_shuttlecocks (buffet_id, shuttlecock_type_id, quantity)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE quantity = ?;
            `;

            const [results] = await connection.query(query, [id, shuttlecock_type_id, quantity, quantity]);

            res.json({ message: 'Shuttlecock quantity updated successfully', results });

        } catch (error) {
            console.error('Error updating shuttlecock quantity:', error);
            res.status(500).json({ error: 'Failed to update shuttlecock quantity' });
        } finally {
            connection.release();
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
