import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

// Create a MySQL connection pool
const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  // ssl: {
  //   rejectUnauthorized: true,
  //   }
});

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const query = `SELECT id	, team_name	,Name_1	,Nickname_1	,age_1	,gender_1,	affiliation_1	,image_1	,Name_2	,Nickname_2	,age_2	,gender_2	,affiliation_2,image_2	,level,status,	paymentStatus	 FROM tournament`;

    // Execute the SQL query to fetch time slots
    const [results] = await connection.query(query);
   res.json({ detail :results });

    
  } catch (error) {
    console.error('Error fetching time slots:', error);
    res.status(500).json({ error: 'Error fetching time slots' });
  }
};
