import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { RowDataPacket } from 'mysql2';
import { getToken } from 'next-auth/jwt';

export default async function deleteHoliday(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    // Get the session token from the request cookies
    const token = await getToken({ req })
    if (!token) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    const connection = await pool.getConnection();
    try {
      const query = 'DELETE FROM pt_reserve WHERE id = ?;';
      const { id } = req.query; // Access the id from the query parameters

      // Execute the SQL query to delete the holiday
      const [results] = await connection.query(query, [id]);

      // Check if any rows were affected (i.e., if the holiday was deleted successfully)
      if ((results as RowDataPacket).affectedRows > 0) {
        res.json({ message: 'pt_reserve deleted successfully.' });
      } else {
        res.status(404).json({ message: 'pt_reserve not found.' });
      }
    } catch (error) {
      console.error('Error deleting pt_reserve:', error);
      res.status(500).json({ error: 'Error deleting pt_reserve' });
    } finally {
      connection.release(); // Release the connection back to the pool when done
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}