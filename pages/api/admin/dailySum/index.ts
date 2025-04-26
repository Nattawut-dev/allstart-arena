import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = await getToken({ req });
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    const connection = await pool.getConnection();
    try {
        const { selectedValue } = req.query;
        const days = parseInt(selectedValue as string || '5');

        const [rows] = await connection.query(
            `
            SELECT * FROM daily_summary_view 
            ORDER BY pay_date_converted DESC
            LIMIT ?
            `,
            [days]
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching daily summary:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        connection.release();
    }
}
