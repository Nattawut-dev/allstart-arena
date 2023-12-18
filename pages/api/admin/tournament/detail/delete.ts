import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { RowDataPacket } from 'mysql2';
import { getToken } from 'next-auth/jwt';

export default async function deleteHoliday(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'DELETE') {
        const token = await getToken({ req })
        if (!token) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const connection = await pool.getConnection();
        try {

            const query = 'DELETE FROM tournament WHERE id = ?;';
            const { id } = req.query;
            const [results] = await connection.query(query, [id]);

            if ((results as RowDataPacket).affectedRows > 0) {
                res.json({ message: 'tournament deleted successfully.' });
            } else {
                res.status(404).json({ message: 'tournament not found.' });
            }
        } catch (error) {
            console.error('Error deleting tournament:', error);
            res.status(500).json({ error: 'Error deleting tournament' });
        } finally {
            connection.release(); // Release the connection back to the pool when done
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}