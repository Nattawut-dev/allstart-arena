import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { title, date, status } = req.body;
    const connection = await pool.getConnection();
    try {
        const query = `INSERT INTO holidays (title, date, status)
        SELECT ?, ?, ?
        WHERE NOT EXISTS (
          SELECT 1 FROM holidays WHERE date = ?
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