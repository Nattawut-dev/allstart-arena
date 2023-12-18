import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { RowDataPacket } from 'mysql2';
import { getToken } from 'next-auth/jwt';

export default async function deleteHoliday(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const token = await getToken({ req })
    if (!token) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
    }
    const connection = await pool.getConnection();
    try {
      const query = 'DELETE FROM listtournament WHERE id = ?;';
      const { id } = req.query; 

      const deleteQuery = 'DELETE FROM listtournament_handlevel WHERE tournament_id = ?';
      const [results1] = await connection.query(deleteQuery, [id]);
      const [results2] = await connection.query(query, [id]);

      // Check if any rows were affected (i.e., if the holiday was deleted successfully)
      if ((results1 as RowDataPacket).affectedRows > 0 && (results2 as RowDataPacket).affectedRows > 0) {
        res.json({ message: 'listtournament deleted successfully.' });
      } else {
        res.status(404).json({ message: 'listtournament not found.' });
      }
    } catch (error) {
      console.error('Error deleting listtournament:', error);
      res.status(500).json({ error: 'Error deleting listtournament' });
    } finally {
      connection.release(); // Release the connection back to the pool when done
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}