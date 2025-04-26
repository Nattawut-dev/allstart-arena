import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { getToken } from 'next-auth/jwt';

export default async function insertData(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        const token = await getToken({ req });
        if (!token) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }

        const connection = await pool.getConnection();
        try {
            const destinationItems = req.body;
            const { q_id, shuttle_cock, shuttlecock_type_id, finish } = req.query;
            if (destinationItems.length === 0) {
                return;
            }

            let queries = 'UPDATE buffet_newbie SET q_list = CASE ';
            const params: any[] = [];
            const targetID: any[] = [];

            for (const item of destinationItems) {
                const { id, q_list } = item;
                queries += 'WHEN id = ? THEN ? ';
                params.push(id, q_list);
                targetID.push(id);
            }

            queries += 'ELSE q_list END, ';

            // เพิ่ม shuttlecock ไปยัง buffet_shuttlecocks
            if (
                shuttle_cock !== 'null' &&
                shuttle_cock != null &&
                shuttle_cock != undefined &&
                shuttle_cock != 'undefined' &&
                shuttlecock_type_id
            ) {
                for (const item of destinationItems) {
                    const { id } = item;
                    await connection.query(
                        `
                        INSERT INTO buffet_newbie_shuttlecocks (buffet_id, shuttlecock_type_id, quantity)
                        VALUES (?, ?, ?)
                        ON DUPLICATE KEY UPDATE quantity = quantity + ?;
                        `,
                        [id, shuttlecock_type_id, shuttle_cock, shuttle_cock]
                    );
                }
            }

            // เพิ่ม couterPlay
            if (finish == 'true') {
                queries += 'couterPlay = CASE ';
                for (const item of destinationItems) {
                    const { id } = item;
                    queries += 'WHEN id = ? THEN couterPlay + 1 ';
                    params.push(id);
                }
                queries += 'ELSE couterPlay END, ';
            }

            queries += 'q_id = ? WHERE id IN (?)';
            params.push(q_id === 'null' ? null : q_id);
            params.push(targetID);

            const [results] = await connection.query(queries, params);

            res.json({ results });

        } catch (error) {
            console.error('Error updating buffet_newbie data:', error);
            res.status(500).json({ error: 'Error updating buffet_newbie data' });
        } finally {
            connection.release();
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
