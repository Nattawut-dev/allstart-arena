import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { getToken } from 'next-auth/jwt';

interface ItemsType {
    [key: string]: string[];
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

            const destinationItems = req.body;
            const qIdParams: any[] = [];
            const targetID: any[] = [];
            const keys = Object.keys(destinationItems);

            let qIdQueries = 'UPDATE buffet SET q_id = CASE ';

            keys.forEach((key, index) => {
                const q_id = index;
                const newdes = destinationItems[key];

                newdes.forEach((item: ItemsType) => {
                    const { id } = item;
                    qIdQueries += 'WHEN id = ? THEN ? ';
                    qIdParams.push(id, q_id);
                    targetID.push(id);
                });
            });

            qIdQueries += 'ELSE q_id END WHERE id IN (?)';
            qIdParams.push(targetID);


            await connection.query(qIdQueries, qIdParams);


            res.json({ message: 'Update successful' });

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
