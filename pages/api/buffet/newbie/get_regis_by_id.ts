import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { format, utcToZonedTime } from 'date-fns-tz';
import { RowDataPacket } from 'mysql2';



export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { id } = req.query; 

        if(!id) {
            return res.status(400).json({ message: 'ID is required' });
        }
        const connection = await pool.getConnection()
        
        try {
            const query = `SELECT buffet_newbie.id , buffet_newbie.nickname, buffet_newbie.usedate, buffet_newbie.price, buffet_newbie.paymentStatus ,buffet_newbie.q_list ,buffet_newbie.q_id , buffet_newbie.couterPlay ,  buffet_newbie.isStudent, buffet_newbie.skillLevel,
            (SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'shuttlecock_type_id', bs.shuttlecock_type_id,
                    'shuttlecock_type', st.name,
                    'quantity', bs.quantity
                )
            )
            FROM buffet_newbie_shuttlecocks bs
            JOIN shuttlecock_types st ON bs.shuttlecock_type_id = st.id
            WHERE bs.buffet_id = buffet_newbie.id
            ) AS shuttlecock_details
            FROM buffet_newbie
            WHERE buffet_newbie.id = ? `;
            // Execute the SQL query to fetch time slots
            const [results] = await connection.query<RowDataPacket[]>(query, [id]);

            res.json(results[0]);
        } catch (error) {
            console.error('Error fetching time slots:', error);
            res.status(500).json({ error: 'Error fetching time slots' });
        } finally {
            connection.release(); // Release the connection back to the pool when done
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};
