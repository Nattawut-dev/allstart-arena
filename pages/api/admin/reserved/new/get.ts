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
        const {status} = req.query
        console.log(status)
        const connection = await pool.getConnection()
        try {
            const query = 'SELECT * FROM reserve WHERE status = ?';

            // Execute the SQL query to fetch time slots
            const [results] = await connection.query(query ,[status]);
            res.json( results );
        } catch (error) {
            console.error('Error fetching reserve:', error);
            res.status(500).json({ error: 'Error fetching reserve' });
        } finally {
            connection.release(); // Release the connection back to the pool when done
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
