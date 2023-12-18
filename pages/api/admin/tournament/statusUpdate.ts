import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { getToken } from 'next-auth/jwt';


export default async function insertData(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        const token = await getToken({ req })
        if (!token) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const connection = await pool.getConnection()
        try {
            const query = `UPDATE listtournament
            SET status = ?
            WHERE id = ? `;
            const { id, newStatus } = req.body
            // Execute the SQL query to fetch time slots
            const [results] = await connection.query(query, [newStatus, id]);
            // Check if the results contain any data to determine success
            if ((results as any).affectedRows > 0) {
                res.status(200).json({ success: true, message: 'Data UPDATING successfully' });
            } else {
                res.status(500).json({ success: false, message: 'Error inserting data' });
            }
        } catch (error) {
            console.error('Error', error);
            res.status(500).json({ error: 'Error UPDATING lisTournament' });
        } finally {
            connection.release(); // Release the connection back to the pool when done
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
