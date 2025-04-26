import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const connection= await pool.getConnection()
  const {date} = req.query
  try {
    const query = `SELECT * FROM pt_holidays WHERE date = ?`;
    // Execute the SQL query to fetch holidays
    const [results] = await connection.query(query,[date]);
    res.json({results });
  } catch (error) {
    console.error('Error fetchingholidays:', error);
    res.status(500).json({ error: 'Error fetching holidays' });
  }  finally {
    connection.release(); // Release the connection back to the pool when done
  }
  
};
