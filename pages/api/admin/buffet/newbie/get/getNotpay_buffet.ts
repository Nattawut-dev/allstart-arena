import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { getToken } from 'next-auth/jwt';

export default async function insertData(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const token = await getToken({ req });
        if (!token) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }

        const connection = await pool.getConnection();
        try {
            const { usedate, page = 1, itemsPerPage = 15 } = req.query;

            const currentPage = parseInt(page as string, 10) || 1;
            const limit = parseInt(itemsPerPage as string, 10) || 15;
            const offset = (currentPage - 1) * limit;

            // 1. Query data with LIMIT OFFSET
            const query = `
                SELECT *
                FROM buffet_newbie
                WHERE usedate = ?
                AND paymentStatus = 0
                ORDER BY id DESC
                LIMIT ? OFFSET ?
            `;
            const [results] = await connection.query(query, [usedate, limit, offset]);

            // 2. Query total count
            const countQuery = `
                SELECT COUNT(*) AS total
                FROM buffet_newbie
                WHERE usedate = ?
                AND paymentStatus = 0
            `;
            const [countResult] = await connection.query(countQuery, [usedate]);
            const totalItems = (countResult as any)[0]?.total || 0;
            const totalPages = Math.ceil(totalItems / limit);

            res.json({
                data: results,
                currentPage,
                totalPages,
                totalItems,
            });

        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Error fetching data' });
        } finally {
            connection.release(); // คืน connection ให้ pool
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
