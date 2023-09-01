import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';

export default async function insertData(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        // Get the session token from the request cookies
        const sessionToken = req.cookies.sessionToken;

        if (!sessionToken) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const { status, payment_status } = req.query
        if (status) {
            const connection = await pool.getConnection()
            try {
                let query = `SELECT * FROM tournament WHERE status = ?  `;
                let params = [status];
                if (payment_status) {
                    query += ` AND paymentStatus = ?`;
                    params.push(payment_status);
                }
                const [results] = await connection.query(query, params);
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
