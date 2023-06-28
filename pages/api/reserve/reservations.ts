import { NextApiRequest, NextApiResponse } from 'next';
import mysql, { RowDataPacket } from 'mysql2/promise';

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  ssl: {
    rejectUnauthorized: true,
  }
});


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // Get reservations from the database
      const query = 'SELECT * FROM reserve';
      const [reservations] = await connection.query(query);
      res.json({ reservations });



    }
    else if (req.method === 'POST') {
      try {

        const { name, phone, court_id, time_slot_id } = req.body;
        // 
        // Check if the data already exists
        const checkQuery =
          'SELECT court_id, time_slot_id, COUNT(*) FROM reserve WHERE court_id = ? AND time_slot_id = ? GROUP BY court_id, time_slot_id HAVING COUNT(*) > 1;';
        const [existingData] = await connection.query<RowDataPacket[]>(checkQuery, [
          court_id,
          time_slot_id,
        ]);
        console.log(existingData.length)
        if (existingData.length > 0) {
          res.status(400).json({ message: 'Duplicate data' });
        }
        else {
          // Insert the data into the database
          const insertQuery =
            'INSERT INTO reserve (name, phone, court_id, time_slot_id) VALUES (?, ?, ?, ?)';
          await connection.query(insertQuery, [name, phone, court_id, time_slot_id]);

          res.status(200).json({ success: true, message: 'Data inserted successfully' });
        }







      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Error inserting data' });
      }


    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
