import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';



export default async function insertData(req: NextApiRequest, res: NextApiResponse) {
  const connection= await pool.getConnection()
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
  }finally {
    connection.release(); // Release the connection back to the pool when done
  }
}
