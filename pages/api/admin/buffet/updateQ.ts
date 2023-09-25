import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';


export default async function insertData(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        // Get the session token from the request cookies
        const sessionToken = req.cookies.sessionToken;

        if (!sessionToken) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const connection = await pool.getConnection()
        try {
            const destinationItems = req.body;
            const { q_id } = req.query;

            if (destinationItems.length === 0) {
                return;
            }
            let queries = 'UPDATE buffet SET q_list = CASE ';
            const params = [];
            let targetID = []
            for (const item of destinationItems) {
                let { id, q_list } = item;
                queries += 'WHEN id = ? THEN ? ';
                params.push(id, q_list);
                targetID.push(id)
            }
            queries += 'ELSE q_list END ,'
            queries += 'q_id = ? WHERE id IN (?)'
            if (q_id === 'null') {
                params.push(null);
            } else {
                params.push(q_id);
            }
            params.push(targetID)
            const [results] = await connection.query(queries, params);
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
