import pool from '@/db/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
    const token = await getToken({ req })
    if (!token) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
    }
    const { id, code, name, price, isActive } = req.body;

    if (!id || typeof code !== 'string' || typeof name !== 'string' || typeof price !== 'number' || typeof isActive !== 'boolean') {
        return res.status(400).json({ message: 'Invalid input data' });
    }

    const connection = await pool.getConnection();
    try {
        const [result] = await connection.query<ResultSetHeader>(
            `
      UPDATE shuttlecock_types
      SET code = ?, name = ?, price = ?, isActive = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
            [code.trim(), name.trim(), price, isActive, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Shuttlecock type not found' });
        }
        return res.status(200).json({ message: 'Shuttlecock type updated successfully' });
    } catch (error) {
        console.error('DB update error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
