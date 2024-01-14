import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';



export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const connection = await pool.getConnection()

  try {
    const { listT_id, level } = req.query;
    const query = `SELECT tournament.id	, tournament.listT_id,  tournament.team_name	, tournament.Name_1	, tournament.Nickname_1		, tournament.gender_1,	 tournament.affiliation_1	, tournament.image_1	, tournament.Name_2	, tournament.Nickname_2	, tournament.age_2	, tournament.gender_2	, tournament.affiliation_2, tournament.image_2	, tournament.level , tournament.status, tournament.team_type,	 tournament.paymentStatus	, tournament.note , hand_level.name as hand_level_name FROM tournament, hand_level  WHERE tournament.listT_id = ? AND tournament.hand_level_id = ? AND tournament.hand_level_id = hand_level.id`;

    // Execute the SQL query to fetch time slots
    const [results] = await connection.query(query, [listT_id, level]);
    res.json({ detail: results });


  } catch (error) {
    console.error('Error fetching time slots:', error);
    res.status(500).json({ error: 'Error fetching time slots' });
  } finally {
    connection.release(); // Release the connection back to the pool when done
  }
};
