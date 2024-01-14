import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { format, utcToZonedTime } from 'date-fns-tz';
import { getToken } from 'next-auth/jwt';



export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const token = await getToken({ req })
    if (!token) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
    }
    const connection = await pool.getConnection()
    try {
        if (req.method === 'PUT') {
            const { options } = req.body;
            const {id} = req.query
            // Insert selectedOptions data into the database
            const sql = 'UPDATE current_cock SET  selected_options = ? WHERE id = ?';

            await connection.query(sql, [JSON.stringify(options) , id])
            res.status(200).json('success')
        } else if (req.method === 'GET') {
            const sql = 'SELECT selected_options FROM current_cock ';

            const [result] = await connection.query(sql )
            res.status(200).json(result)
        } else {
            res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error fetching time slots:', error);
        res.status(500).json({ error: 'Error fetching time slots' });
    } finally {
        connection.release(); // Release the connection back to the pool when done
    }

};
