import { NextApiRequest, NextApiResponse } from 'next';

import pool from '@/db/db';

// const connection = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_DATABASE,

// //   ssl: {
// //     rejectUnauthorized: true,
// //     }
// });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, postnote } = req.body;
  const connection= await pool.getConnection()

  try {
    await connection.query('INSERT INTO protest (content, tournament_id) VALUES (?, ?)', [postnote, id]);

    res.status(200).json({ success: true, message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error inserting data' });
  }finally {
    connection.release(); // Release the connection back to the pool when done
  }
}
