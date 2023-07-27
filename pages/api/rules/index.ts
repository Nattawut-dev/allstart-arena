// get the client
import type { NextApiRequest, NextApiResponse } from 'next'
import pool from '@/db/db';


export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const connection= await pool.getConnection()

  try {
    const query = 'SELECT * FROM rules';

    // Execute the SQL query to fetch time slots
    const [results] = await connection.query(query);
    res.json(results);
  } catch (error) {
    console.error('Error :', error);
    res.status(500).json({ error: 'Error ' });
  }finally {
    connection.release(); // Release the connection back to the pool when done
  }
};
