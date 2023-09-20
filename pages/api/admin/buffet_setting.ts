// pages/api/admin/buffet_setting.ts

import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const connection = await pool.getConnection(); // เชื่อมต่อกับฐานข้อมูล
    try {
        if (req.method === 'GET') {
            const query = 'SELECT * FROM buffet_setting'; // ปรับแก้ตามโครงสร้างของฐานข้อมูลของคุณ
            const [results] = await connection.query(query);
            res.status(200).json(results);
        } else if (req.method === 'PUT') {
            const { id, court_price, shuttle_cock_price } = req.body;

            const query = 'UPDATE buffet_setting SET court_price=?, shuttle_cock_price=? WHERE id=?'; // ปรับแก้ตามโครงสร้างของฐานข้อมูลของคุณ
            const [result] = await connection.query(query, [court_price, shuttle_cock_price, id]);
            res.status(200).json(result);
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        connection.release(); // คืนการเชื่อมต่อกับพูล
    }

};
