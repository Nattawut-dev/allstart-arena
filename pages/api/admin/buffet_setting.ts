import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = await getToken({ req });
    if (!token) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
    }

    const connection = await pool.getConnection();
    try {
        if (req.method === 'GET') {
            // ดึงข้อมูลจาก buffet_setting และ shuttlecock_prices
            const query = `
                SELECT b.id, b.court_price, b.isStudent
                FROM buffet_setting b
            `;
            const [results] = await connection.query(query);
            res.status(200).json(results);
        } else if (req.method === 'PUT') {
            const { id, court_price, isStudent } = req.body;

            // อัปเดตข้อมูลใน buffet_setting
            const updateQuery = 'UPDATE buffet_setting SET court_price=?, isStudent=? WHERE id=?';
            await connection.query(updateQuery, [court_price, isStudent, id]);

            res.status(200).json({ message: 'Data updated successfully' });
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        connection.release();
    }
};
