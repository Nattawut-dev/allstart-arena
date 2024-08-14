import { NextRequest, NextResponse } from 'next/server';
import pool from '@/db/db';
import { RowDataPacket } from 'mysql2';
import { NextApiResponse } from 'next';
import { buffetStatusEnum } from '@/enum/buffetStatusEnum';
import { paymentStatusEnum } from '@/enum/paymentStatusEnum';

export const dynamic = "force-dynamic";

export default async function handle(req: NextRequest, res: NextApiResponse) {


    const connection = await pool.getConnection();

    try {

        const baseQuery = `
        SELECT 
          pc.customerID, 
          pc.barcode,
          pc.customerName,
          pc.paymentStatus AS customerPaymentStatus, 
          ps.PaymentStatus,
          SUM(CASE 
            WHEN pos_sales.flag_delete = false 
            THEN pos_sales.TotalAmount 
            ELSE 0 
          END) AS pendingMoney
        FROM pos_customers pc
        LEFT JOIN (
          SELECT CustomerID, MAX(PaymentStatus) AS PaymentStatus
          FROM pos_sales
          GROUP BY CustomerID
        ) ps ON ps.CustomerID = pc.customerID
        LEFT JOIN pos_sales ON pos_sales.CustomerID = pc.customerID
        WHERE DATE(pc.register_date) = CURDATE()
        AND pc.buffetStatus = ?
        GROUP BY pc.customerID, pc.barcode, pc.customerName, pc.paymentStatus, ps.PaymentStatus
      `;
  
      const params = [ buffetStatusEnum.CREDIT_USER];
      const [customers] = await connection.execute<RowDataPacket[]>(baseQuery, params);




        return res.status(200).json({ customers });

    } catch (error) {
        console.error('Error fetching customers:', error);
        return res.status(500).json({ error: 'Error fetching customers data' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
}
