import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';


export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const connection= await pool.getConnection()
  try {
    const {tournament_id} = req.query
    const query = `SELECT hand_level.id , hand_level.name  , listtournament_handlevel.max_team_number , listtournament_handlevel.price
    FROM listtournament_handlevel
    JOIN hand_level ON listtournament_handlevel.hand_level_id = hand_level.id
    WHERE listtournament_handlevel.tournament_id = ?;`;

    // Execute the SQL query to fetch time slots
    const [results] = await connection.query(query , [tournament_id]);
    res.json( results );
  } catch (error) {
    console.error('Error fetching time slots:', error);
    res.status(500).json({ error: 'Error fetching time slots' });
  }finally {
    connection.release(); // Release the connection back to the pool when done
  }
};
