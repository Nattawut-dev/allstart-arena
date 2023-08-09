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
            const query = 'UPDATE listtournament SET title = ? , ordinal = ? , location = ? , timebetween = ? WHERE id = ?';
            const { id, title, ordinal, location, timebetween } = req.body
            // Execute the SQL query to fetch time slots
            const [results] = await connection.query(query, [title, ordinal, location, timebetween, id]);

            if ((results as any).affectedRows > 0) {
                res.status(200).json({ success: true, message: 'Data UPDATING successfully' });
            } else {
                res.status(500).json({ success: false, message: 'Error inserting data' });
            }
        } catch (error) {
            console.error('Error UPDATING lisTournamen:', error);
            res.status(500).json({ error: 'Error UPDATING lisTournamen' });
        } finally {
            connection.release(); // Release the connection back to the pool when done
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
