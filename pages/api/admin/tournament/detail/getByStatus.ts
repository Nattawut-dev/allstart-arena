import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { getToken } from 'next-auth/jwt';

export default async function insertData(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const token = await getToken({ req })
        if (!token) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const { status, paymentStatus, listT_id , hand_level } = req.query
        console.log("hand_level" , hand_level)
        if (status) {
            const connection = await pool.getConnection();
            try {
                let query = `SELECT tournament.*, hand_level.name as hand_level_name
                FROM tournament, hand_level  WHERE tournament.hand_level_id = hand_level.id`; // เพิ่ม WHERE 1 เพื่อให้สามารถเรียงเงื่อนไขต่อไปได้
                let params = [];

                if (status !== 'all') {
                    query += ` AND status = ?`;
                    params.push(status);
                }

                if (paymentStatus !== 'all' && paymentStatus) {
                    query += ` AND paymentStatus = ?`;
                    params.push(paymentStatus);
                }

                if (listT_id) {
                    query += ` AND listT_id = ?`;
                    params.push(listT_id);
                }
                if (hand_level !== 'all' && hand_level) {
                    query += ` AND hand_level_id = ?`;
                    params.push(hand_level);
                }

                const [results] = await connection.query(query, params);
                res.json(results);
            } catch (error) {
                console.error('Error fetching lisTournament:', error);
                res.status(500).json({ error: 'Error fetching lisTournament' });
            } finally {
                connection.release();
            }
        } else {
            // กรณีที่ไม่ได้ระบุ status
            res.status(400).json({ error: 'Status is required' });
        }

    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
