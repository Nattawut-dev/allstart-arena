import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

// Create a MySQL connection pool
const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const query = 'SELECT * FROM cord';

    // Execute the SQL query to fetch time slots
    const [results] = await connection.query(query);
    res.json({ courts: results });
  } catch (error) {
    console.error('Error fetching time slots:', error);
    res.status(500).json({ error: 'Error fetching time slots' });
  }
};
