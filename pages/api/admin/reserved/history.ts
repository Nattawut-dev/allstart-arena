import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     if (req.method === 'GET') {
//         try {
//             const { search } = req.query;
//             const connection = await pool.getConnection();
//             console.log(search)
//             let query = 'SELECT  * FROM reserve';
//             const queryParams = [];

//             if (search) {
//                 query += ' WHERE name LIKE ? OR phone LIKE ? OR usedate LIKE ?';
//                 queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
//             }

//             query += ' ORDER BY id DESC LIMIT 1000 ';



//             const [results] = await connection.query(query, queryParams);
//             res.json(results);
//         } catch (error) {
//             console.error('Error fetching reserve history:', error);
//             res.status(500).json({ error: 'Error fetching reserve history' });
//         }
//     } else {
//         res.status(405).json({ message: 'Method not allowed' });
//     }
// }

export default async function get(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        // Get the session token from the request cookies
        const sessionToken = req.cookies.sessionToken;

        if (!sessionToken) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const { search } = req.query;
        const connection = await pool.getConnection()
            console.log(search)

        try {
            const query = search === undefined ? 'SELECT  * FROM reserve ORDER BY id DESC LIMIT 1000 ' :
                'SELECT  * FROM reserve WHERE name LIKE ? OR phone LIKE ? OR usedate LIKE ? ORDER BY id DESC LIMIT 1000 '

            // Execute the SQL query to fetch time slots
            const [results] = await connection.query(query, [`%${search}%`, `%${search}%`, `%${search}%`]);
            res.json(results);
        } catch (error) {
            console.error('Error fetching reserve:', error);
            res.status(500).json({ error: 'Error fetching reserve' });
        } finally {
            connection.release(); // Release the connection back to the pool when done
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
