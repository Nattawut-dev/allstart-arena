import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { getToken } from 'next-auth/jwt';

export default async function insertData(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const token = await getToken({ req })
        if (!token) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const connection = await pool.getConnection()
        try {
            const { id } = req.query
            const query = `SELECT 
    ROUND(
       bs.court_price
        +
        (b.shuttle_cock * (bs.shuttle_cock_price / 4)),
        2
    ) AS total_shuttle_cock
FROM 
    buffet_setting_newbie bs
JOIN 
    buffet_newbie b ON b.id = ?
WHERE 
    bs.isStudent = b.isStudent
`;

            // Execute the SQL query to fetch time slots
            const [results] = await connection.query(query, [id]);
            res.json(results);
        } catch (error) {
            console.error('Error fetching:', error);
            res.status(500).json({ error: 'Error fetching' });
        } finally {
            connection.release(); // Release the connection back to the pool when done
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
