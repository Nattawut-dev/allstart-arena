import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { getToken } from 'next-auth/jwt';


export default async function insertData(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        const token = await getToken({ req })
        if (!token) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const connection = await pool.getConnection()
        try {
            const query = `
            UPDATE tournament AS t
            SET t.status = ?,
                t.team_type = CASE
                    WHEN ? != 2 THEN ?
                    ELSE CASE
                        WHEN (
                            SELECT lt.max_team_number >= LENGTH(t.level)
                            FROM listtournament_handlevel AS lt
                            INNER JOIN hand_level AS hl ON lt.hand_level_id = hl.id
                            WHERE lt.tournament_id = t.listT_id AND hl.name = t.level
                        ) THEN 'ทีมหลัก'
                        ELSE 'ทีมสำรอง'
                    END
                END
            WHERE t.id = ?;
        `;
        
        const { id, newStatus, team_type } = req.body;
        
            const [results] = await connection.query(query, [newStatus,newStatus, team_type , id ]);
            res.json({ results });
        } catch (error) {
            console.error('Error updating tournament:', error);
            res.status(500).json({ error: 'Error updating tournament' });
        } finally {
            connection.release(); // Release the connection back to the pool when done
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
