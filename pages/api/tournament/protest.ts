import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, postnote ,listTournament_id } = req.body;
  const connection= await pool.getConnection()

  try {
    await connection.query('INSERT INTO protest (content, tournament_id ,listT_id ) VALUES (?, ? ,?)', [postnote, id , listTournament_id]);

    res.status(200).json({ success: true, message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error inserting data' });
  }finally {
    connection.release(); // Release the connection back to the pool when done
  }
}
