import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { getToken } from 'next-auth/jwt';


export default async function updateData(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        const token = await getToken({ req })
        if (!token) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const connection = await pool.getConnection()
        try {
            await connection.beginTransaction(); // เริ่ม Transaction

            const queryListTournament = 'UPDATE listtournament SET title = ?, ordinal = ?, location = ?, timebetween = ?, max_team = ? WHERE id = ?';
            const queryListTournamentHandLevel = 'INSERT IGNORE INTO listtournament_handlevel (tournament_id, hand_level_id ,max_team_number , price ) VALUES (?, ? , ? , ?)';

            const { id, title, ordinal, location, timebetween, max_team, hand_levels } = req.body;
            // Execute the SQL query to update data in listtournament table
            const [resultsListTournament] = await connection.query(queryListTournament, [title, ordinal, location, timebetween, max_team, id]);
            const deleteQuery = 'DELETE FROM listtournament_handlevel WHERE tournament_id = ?';
            await connection.query(deleteQuery, [id]);
            const promises = Object.entries(hand_levels).map(async ([hand_level_id, max_team_value ]) => {
                const { value, price } = max_team_value as { value: number, price: number }; 
                const results = await connection.query(queryListTournamentHandLevel, [id, hand_level_id, value, price]);
                return results;
              });
            await Promise.all(promises);

            await connection.commit(); // Commit Transaction เมื่อทุกคำสั่ง SQL ทำงานสำเร็จ

            res.status(200).json({ success: true, message: 'Data UPDATING successfully' , resultsListTournament });
        } catch (error) {
            await connection.rollback(); // Rollback Transaction ในกรณีที่เกิดข้อผิดพลาด
            console.error('Error UPDATING data:', error);
            res.status(500).json({ error: 'Error UPDATING data' });
        } finally {
            connection.release(); // Release the connection back to the pool when done
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
