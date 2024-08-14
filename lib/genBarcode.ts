import pool from "@/db/db";
import { RowDataPacket } from "mysql2";

export const generateUniqueBarcode = async (): Promise<string> => {
    
    let isUnique = false;
    let barcode = '';
    const connection = await pool.getConnection();
    while (!isUnique) {
        barcode = Math.random().toString(36).substr(2, 9).toUpperCase();
        const checkQuery = 'SELECT COUNT(*) as count FROM pos_customers WHERE barcode = ?';
        const [checkResult] = await connection.execute<RowDataPacket[]>(checkQuery, [barcode]);

        if (checkResult[0].count === 0) {
            isUnique = true;
        }
    }

    return barcode;
};
