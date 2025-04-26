import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { getToken } from 'next-auth/jwt';



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = await getToken({ req })
    if (!token) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
    }
    const { title, date, status } = req.body;
    const connection = await pool.getConnection();
    try {
        const query = `INSERT INTO pt_holidays (title, date, status)
        SELECT ?, ?, ?
        WHERE NOT EXISTS (
          SELECT 1 FROM pt_holidays WHERE date = ?
        )`;
        // Execute the SQL query to insert data
        const [results] = await connection.query(query, [title, date, status, date]);

        // Check if the results contain any data to determine success
        if ((results as any).affectedRows > 0) {
            res.status(200).json({ success: true, message: 'Data inserted successfully' });
        } else {
            res.status(500).json({ success: false, message: 'Error inserting data' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error inserting data' });
    } finally {
        connection.release(); // Release the connection back to the pool when done
    }
}