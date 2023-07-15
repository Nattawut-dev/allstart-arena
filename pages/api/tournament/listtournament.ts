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
    const query = 'SELECT * FROM listtournament';

    // Execute the SQL query to fetch time slots
    const [results] =  await connection.query(query);
    res.json({results});
  } catch (error) {
    console.error('Error fetching:', error);
    res.status(500).json({ error: 'Error fetching' });
  }
};
