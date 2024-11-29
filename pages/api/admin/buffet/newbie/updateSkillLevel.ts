import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { getToken } from 'next-auth/jwt';



export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const token = await getToken({ req })
    if (!token) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
    }
    const connection = await pool.getConnection()
    try {
        if (req.method === 'PUT') {
            const { userId, skillLevel } = req.body

            const sql = 'UPDATE buffet_newbie SET skillLevel = ? WHERE id = ?';

            await connection.query(sql, [skillLevel, userId])
            res.status(200).json({ message: 'successfully updated' })
        } else {
            res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error fetching time slots:', error);
        res.status(500).json({ error: 'Error fetching time slots' });
    } finally {
        connection.release(); // Release the connection back to the pool when done
    }

};
