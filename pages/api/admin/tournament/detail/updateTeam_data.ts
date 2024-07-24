import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { getToken } from 'next-auth/jwt';

interface Detail {
    id: number;
    listT_id: number
    team_name: string;
    Name_1: string;
    Nickname_1: string;
    age_1: number;
    gender_1: string;
    affiliation_1: string;
    tel_1: string;
    image_1?: string;
    Name_2?: string;
    Nickname_2?: string;
    age_2?: number;
    gender_2?: string;
    affiliation_2?: string;
    tel_2?: string;
    image_2?: string;
    level: string;
    status: number;
    price: number;
    slipurl: string;
    team_type: string;
    paymentStatus: number;
    hand_level_id : number;
}
export default async function insertData(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        // Get the session token from the request cookies
        const token = await getToken({ req })
        if (!token) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const connection = await pool.getConnection()
        try {
            const query = 'UPDATE tournament SET Name_1 = ?,Nickname_1= ?,age_1= ?,gender_1= ?,affiliation_1= ?,tel_1= ?,Name_2= ?,Nickname_2=?,age_2= ?,gender_2= ?,affiliation_2= ?,tel_2= ? , hand_level_id = ?  WHERE id = ?;';
            const team_detail : Detail= req.body
            // Execute the SQL query to fetch time slots
            const [results] = await connection.query(query, [
                team_detail.Name_1 , 
                team_detail.Nickname_1,
                team_detail.age_1,
                team_detail.gender_1,
                team_detail.affiliation_1,
                team_detail.tel_1,
                team_detail.Name_2,
                team_detail.Nickname_2,
                team_detail.age_2,
                team_detail.gender_2,
                team_detail.affiliation_2,
                team_detail.tel_2,
                team_detail.hand_level_id,
                team_detail.id,

            ]);
            res.json({ results });
        } catch (error) {
            console.error('Error fetching holidays:', error);
            res.status(500).json({ error: 'Error fetching holidays' });
        } finally {
            connection.release(); // Release the connection back to the pool when done
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
