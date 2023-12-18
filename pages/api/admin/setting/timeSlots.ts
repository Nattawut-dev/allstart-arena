import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = await getToken({ req })
    if (!token) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
    }
    const connection = await pool.getConnection();

    try {
        if (req.method === 'GET') {
            const [results] = await connection.query('SELECT * FROM time');
            res.status(200).json(results);
        } else if (req.method === 'POST') {
            const { title, start_time, end_time, price, status } = req.body;

            const [result] = await connection.query(
                'INSERT INTO time (title, start_time, end_time, price, status) VALUES (?, ?, ?, ?, ?)',
                [title, start_time, end_time, price, status]
            );
            res.status(201).json(result);
        } else if (req.method === 'PUT') {
            const { id, title, start_time, end_time, price, status } = req.body;

            await connection.query(
                'UPDATE time SET title = ?, start_time = ?, end_time = ?, price = ?, status = ? WHERE id = ?',
                [title, start_time, end_time, price, status, id]
            );
            const [updatedTimeSlot] = await connection.query('SELECT * FROM time WHERE id = ?', [id]);
            res.status(200).json(updatedTimeSlot);
        } else if (req.method === 'DELETE') {
            const { id } = req.query;

            await connection.query('DELETE FROM time WHERE id = ?', [id]);
            res.status(204).end();
        } else {
            res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        connection.release();
    }
}
