import mysql from 'mysql2/promise';
import { NextApiRequest, NextApiResponse } from 'next';
import connection from '@/db/db';

// const connection = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_DATABASE,
//   // ssl: {
//   //   rejectUnauthorized: true,
//   //   }
// });

export default async function insertData(req: NextApiRequest, res: NextApiResponse) {

  try {
    const { name,court_id,startvalue,endvalue,usedate,slip,status} = req.body
    await connection.query('UPDATE reserve SET slip = ? ,status =? WHERE name = ? AND court_id = ? AND start_time = ? AND end_time = ? AND usedate = ?', [
      slip,status,name,court_id,startvalue,endvalue,usedate
    ]);
    res.status(200).json((""))
  } catch (error) {
    return {
      success: false,
    };
  }
}
