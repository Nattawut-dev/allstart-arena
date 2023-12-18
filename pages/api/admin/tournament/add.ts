import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { getToken } from 'next-auth/jwt';



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = await getToken({ req })
    if (!token) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
    }
    const connection = await pool.getConnection();
    try {

        await connection.beginTransaction(); // เริ่ม Transaction
        const query = `INSERT INTO listtournament (title, ordinal, location, timebetween , max_team) VALUES (?, ?, ?, ?,?);`;
        const queryListTournamentHandLevel = 'INSERT IGNORE INTO listtournament_handlevel (tournament_id, hand_level_id ,max_team_number , price ) VALUES (?, ? , ? , ?)';
        const { title, ordinal, location, timebetween, max_team, maxTeamValues } = req.body;

        const [results]: any = await connection.query(query, [title, ordinal, location, timebetween, max_team]);
        const { insertId } = results;
        if(insertId) {
            const promises = Object.entries(maxTeamValues).map(async ([hand_level_id, max_team_value ]) => {
                const { value, price } = max_team_value as { value: number, price: number }; 
                const results = await connection.query(queryListTournamentHandLevel, [insertId, hand_level_id, value, price]);
                return results;
              });
            await Promise.all(promises);
        }

        await connection.commit(); // Commit Transaction เมื่อทุกคำสั่ง SQL ทำงานสำเร็จ

        res.status(200).json({ success: true, message: 'Data UPDATING successfully' });

    } catch (error) {
        await connection.rollback(); 
        res.status(500).json({ success: false, message: 'Error inserting data' });
    } finally {
        connection.release(); // Release the connection back to the pool when done
    }
}