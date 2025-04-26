import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { getToken } from 'next-auth/jwt';
import { buffetStatusEnum } from '@/enum/buffetStatusEnum';
import { RowDataPacket } from 'mysql2';

export default async function insertData(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const token = await getToken({ req });
    if (!token) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    const connection = await pool.getConnection();
    try {
        const { page = 1, limit = 15, search = '' } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        

        const query = `
        SELECT SQL_CALC_FOUND_ROWS
            b.*
        FROM buffet b
        JOIN buffet_setting bs ON bs.isStudent = b.isStudent
        LEFT JOIN pos_sales ON pos_sales.CustomerID = (
            SELECT pc.customerID
            FROM pos_customers pc
            WHERE pc.playerId = b.id AND pc.buffetStatus = '${buffetStatusEnum.BUFFET}'
            LIMIT 1
        )
        WHERE (b.nickname LIKE ? OR b.phone LIKE ? OR usedate LIKE ?)
        GROUP BY b.id, bs.court_price, bs.shuttle_cock_price, b.shuttle_cock
        ORDER BY b.id DESC
        LIMIT ? OFFSET ?
        `;

        const [results] = await connection.query(query, [`%${search}%`, `%${search}%`, `%${search}%`,Number(limit), offset]);

        // ดึงจำนวนทั้งหมดเพื่อใช้กับ pagination
        const [[{ total_items }]] = await connection.query<RowDataPacket[]>('SELECT FOUND_ROWS() as total_items');
        
        res.json({
            data: results,
            total_items,
        });
        
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    } finally {
        connection.release();
    }
}
