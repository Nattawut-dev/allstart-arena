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
            const query = 'UPDATE pt_reserve SET status = ? WHERE id = ?;';
            const {id , newStatus} = req.body
            // Execute the SQL query to fetch time slots
            console.log(newStatus)
            const [results] = await connection.query(query,[newStatus,id]);
            res.json({ results });
        } catch (error) {
            console.error('Error fetching pt_reserve:', error);
            res.status(500).json({ error: 'Error fetching pt_reserve' });
        } finally {
            connection.release(); // Release the connection back to the pool when done
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
