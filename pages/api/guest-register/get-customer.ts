import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { RowDataPacket } from 'mysql2';
import { buffetStatusEnum } from '@/enum/buffetStatusEnum';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const connection = await pool.getConnection();

    try {
        if (req.method !== 'GET') {
            res.status(405).json({ error: 'Method not allowed' });
            return;
        }
        

        const insertCustomerQuery = `
            SELECT customerID, barcode, customerName 
            FROM pos_customers 
            WHERE buffetStatus = ? AND DATE(register_date) = CURDATE() 
        `;

        const [results] = await connection.query<RowDataPacket[]>(insertCustomerQuery, [buffetStatusEnum.CREDIT_USER]);

        if (results.length > 0) {
            res.status(200).json(results);
        } else {
            res.status(404).json({ success: false, message: 'No data found' });
        }
        
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        connection.release();
    }
}
