// import { NextApiRequest, NextApiResponse } from 'next';
// import pool from '@/db/db';



// export default async function handle(req: NextApiRequest, res: NextApiResponse) {
//   const connection= await pool.getConnection()

//   try {
//     const {team_name} = req.query
//     const query = 'SELECT team_name FROM tournament WHERE team_name like ?';

//     // Execute the SQL query to fetch time slots
//     const [results] = await connection.query(query ,[`${team_name}%`]);
//     res.json({results });
//   } catch (error) {
//     console.error('Error fetching time slots:', error);
//     res.status(500).json({ error: 'Error fetching time slots' });
//   }finally {
//     connection.release(); // Release the connection back to the pool when done
//   }
// };
