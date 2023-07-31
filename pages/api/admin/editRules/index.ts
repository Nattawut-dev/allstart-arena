import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';



export default async function insertData(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        // Get the session token from the request cookies
        const sessionToken = req.cookies.sessionToken;

        if (!sessionToken) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const connection = await pool.getConnection()
        try {
            const { title, content,line_id,tel,facebook_title,facebook_url,id } = req.body
            await connection.query('UPDATE rules SET title = ? ,content =?,line_id= ? , tel = ? ,facebook_title = ? , facebook_url = ?  WHERE id = ?', [
                title, content,line_id,tel,facebook_title,facebook_url,id
            ]);
            res.status(200).json((""))
        } catch (error) {
            return res.status(500).json({ error: 'Server error' });
        } finally {
            connection.release(); // Release the connection back to the pool when done
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
