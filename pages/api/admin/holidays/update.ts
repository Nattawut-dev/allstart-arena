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
            const query = 'UPDATE holidays SET title = ? , date = ? , status = ? WHERE id = ?;';
            const {id , title , date ,status} = req.body
            // Execute the SQL query to fetch time slots
            const [results] = await connection.query(query,[title, date ,status,id]);
            res.json({ results });
        } catch (error) {
            console.error('Error fetching holidays:', error);
            res.status(500).json({ error: 'Error fetching holidays' });
        } finally {
            connection.release(); // Release the connection back to the pool when done
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
