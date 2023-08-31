import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';


export default async function insertData(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        // Get the session token from the request cookies
        const sessionToken = req.cookies.sessionToken;

        if (!sessionToken) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const connection = await pool.getConnection()
        try {
            const query = 'UPDATE tournament SET paymentStatus = ? WHERE id = ?;';
            const { id, newStatus } = req.body
            const [results] = await connection.query(query, [newStatus, id]);
            res.json({ results });
        } catch (error) {
            console.error('Error updating tournament:', error);
            res.status(500).json({ error: 'Error updating tournament' });
        } finally {
            connection.release(); // Release the connection back to the pool when done
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
