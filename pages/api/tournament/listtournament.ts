import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';



export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const connection = await pool.getConnection()

  try {
    const { id } = req.query
    if (id) {
      const [results] = await connection.query('SELECT * FROM listtournament WHERE id = ?', [id])
      res.json({ results });
    } else {
      const query = 'SELECT * FROM listtournament  WHERE status = 1';
      const [results] = await connection.query(query);
      res.json({ results });
    }

  } catch (error) {
    console.error('Error fetching:', error);
    res.status(500).json({ error: 'Error fetching' });
  } finally {
    connection.release(); // Release the connection back to the pool when done
  }
};
