import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';



export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const connection= await pool.getConnection()

  try {
    const listT_id = req.query.listT_id;
    const query = `SELECT id	,listT_id, team_name	,Name_1	,Nickname_1	,age_1	,gender_1,	affiliation_1	,image_1	,Name_2	,Nickname_2	,age_2	,gender_2	,affiliation_2,image_2	,level,status,	paymentStatus	,note FROM tournament  WHERE listT_id = ?`;

    // Execute the SQL query to fetch time slots
    const [results] = await connection.query(query ,[listT_id]);
   res.json({ detail :results });

    
  } catch (error) {
    console.error('Error fetching time slots:', error);
    res.status(500).json({ error: 'Error fetching time slots' });
  }finally {
    connection.release(); // Release the connection back to the pool when done
  }
};
