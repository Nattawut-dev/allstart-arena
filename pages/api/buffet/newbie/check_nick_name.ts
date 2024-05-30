import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';



export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const connection= await pool.getConnection()

  try {
    const {nickname , usedate} = req.query
    const query = 'SELECT nickname FROM buffet_newbie WHERE nickname = ? AND usedate = ?';

    // Execute the SQL query to fetch time slots
    const [results] = await connection.query(query ,[`${nickname}` , usedate]);
    res.json(results );
  } catch (error) {
    console.error('Error  :', error);
    res.status(500).json({ error: 'Error f' });
  }finally {
    connection.release(); // Release the connection back to the pool when done
  }
};
