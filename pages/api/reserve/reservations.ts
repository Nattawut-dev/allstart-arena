import { NextApiRequest, NextApiResponse } from 'next';
import mysql, { OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import db from '@/db/db';
const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  // ssl : {rejectUnauthorized: true}
});


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const query = 'SELECT id,name, court_id, time_slot_id,usedate ,start_time,end_time, price ,status FROM reserve';
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

        console.log((result as any).affectedRows)
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
  }
}
