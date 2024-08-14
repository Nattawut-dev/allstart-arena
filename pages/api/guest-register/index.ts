import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { buffetStatusEnum } from '@/enum/buffetStatusEnum';
import { FIRST_BARCODE } from '@/constant/firstBarcode';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const connection = await pool.getConnection();

    try {
        const { nickname, phone } = req.body;

        if (req.method !== 'POST') {
            res.status(405).json({ error: 'Method not allowed' });
            return;
        }

        // Check if the nickname is unique
        const checkNicknameQuery = 'SELECT COUNT(*) AS count FROM pos_customers WHERE CustomerName = ? AND DATE(register_date) = CURDATE() AND buffetStatus = ?';
        const [checkNicknameResults] = await connection.query<RowDataPacket[]>(checkNicknameQuery, [nickname, buffetStatusEnum.CREDIT_USER]);
        const { count } = checkNicknameResults[0];


        if (count > 0) {
            res.status(400).json({ success: false, message: 'Nickname already exists' });
            return;
        }

        const barcode = FIRST_BARCODE;
        const insertCustomerQuery = `
            INSERT INTO pos_customers (phone, CustomerName, buffetStatus, barcode) 
            SELECT 
                ?, 
                ?, 
                ?, 
                COALESCE(
                    (SELECT barcode FROM pos_customers 
                     WHERE DATE(register_date) = CURDATE() 
                     ORDER BY barcode DESC 
                     LIMIT 1) + 1,
                    ${barcode}
                )
            
        `;
        const [insertCustomerResults] = await connection.query<ResultSetHeader>(insertCustomerQuery, [phone, nickname, buffetStatusEnum.CREDIT_USER]);


        if (insertCustomerResults.affectedRows > 0) {
            const query = `SELECT barcode from pos_customers WHERE customerID = ?`
            const [barcode] = await connection.query<RowDataPacket[]>(query, [insertCustomerResults.insertId]);

            res.status(200).json({ barcode: barcode[0], success: true, message: 'Data inserted successfully' });
        } else {
            res.status(500).json({ success: false, message: 'Error inserting data' });
        }

    } catch (error) {
        console.log('error', error)
        res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        connection.release();
    }
}
