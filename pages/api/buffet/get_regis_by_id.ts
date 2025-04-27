import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { format, utcToZonedTime } from 'date-fns-tz';
import { RowDataPacket } from 'mysql2';



export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ message: 'ID is required' });
        }
        const connection = await pool.getConnection()

        try {
            const query = `SELECT buffet.id , buffet.nickname, buffet.usedate, buffet.price, buffet.paymentStatus ,buffet.q_list ,buffet.q_id , buffet.couterPlay ,  buffet.isStudent, buffet.skillLevel,
            (SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'shuttlecock_type_id', bs.shuttlecock_type_id,
                    'shuttlecock_type', st.name,
                    'quantity', bs.quantity
                )
            )
            FROM buffet_shuttlecocks bs
            JOIN shuttlecock_types st ON bs.shuttlecock_type_id = st.id
            WHERE bs.buffet_id = buffet.id
            ) AS shuttlecock_details
            FROM buffet
            WHERE buffet.id = ? `;
            // Execute the SQL query to fetch time slots
            const [results] = await connection.query<RowDataPacket[]>(query, [id]);

            // Check if any result was found
            if (results.length === 0) {
                return res.status(404).json({ message: 'No data found for this ID' });
            }

            // Parse shuttlecock_details if it's a string
            const result = results[0];
            if (typeof result.shuttlecock_details === 'string') {
                try {
                    result.shuttlecock_details = JSON.parse(result.shuttlecock_details);
                } catch (err) {
                    console.error('Failed to parse shuttlecock_details:', err);
                    result.shuttlecock_details = [];
                }
            }

            // Return the processed result
            res.status(200).json(result);
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
