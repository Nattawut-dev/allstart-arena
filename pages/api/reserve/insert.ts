// import { NextApiRequest, NextApiResponse } from 'next';
// import insertData from './insertData';

// export default async function handleAPIRequest(req: NextApiRequest, res: NextApiResponse): Promise<void> {
//   const { name, phone } = req.query;

//   try {
//     const result = await insertData(name as string, phone as string);
//     res.status(200).json(result); // Send a success response to the client
//   } catch (error) {
//     res.status(500).json({ success: false,  }); // Send an error response to the client
//   }
// }
import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name, phone } = req.body;

  try {
    await connection.query('INSERT INTO reserve (name, phone) VALUES (?, ?)', [name, phone]);

    res.status(200).json({ success: true, message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error inserting data' });
  }
}
