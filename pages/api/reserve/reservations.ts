import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const connection = await pool.getConnection()

  try {
    if (req.method === 'GET') {
      const query = 'SELECT id,name, court_id, time_slot_id,reserved_date, usedate ,start_time,end_time, price ,status FROM reserve';
      const [reservations] = await connection.query(query);
      res.json(reservations);



    }
    else if (req.method === 'POST') {
      try {

        const { name, phone, court_id, time_slot_id, startvalue, endvalue, usedate, price } = req.body;
        const insertQuery = `
       INSERT INTO reserve (name, phone, court_id, time_slot_id, start_time, end_time, usedate, price)
       SELECT ?, ?, ?, ?, ?, ?, ?, ?
       WHERE NOT EXISTS (
       SELECT *
       FROM reserve
       WHERE court_id = ? AND usedate = ? AND (
      (CAST(start_time AS TIME) >= CAST(? AS TIME) AND CAST(end_time AS TIME) <= CAST(? AS TIME))
    )
  )
`;
        const params = [name, phone, court_id, time_slot_id, startvalue, endvalue, usedate, price, court_id, usedate, startvalue, endvalue
        ];
        const [result] = await connection.query(insertQuery, params);

        if ((result as any).affectedRows === 1) {
          res.status(200).json({ success: true, message: 'Data inserted successfully' });
        } else {
          res.status(400).json({ message: 'Duplicate data' });
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
  } finally {
    connection.release(); // Release the connection back to the pool when done
  }
}
