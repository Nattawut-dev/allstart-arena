import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { format, utcToZonedTime } from 'date-fns-tz';
import { buffetStatusEnum } from '@/enum/buffetStatusEnum';
import { RowDataPacket } from 'mysql2';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const connection = await pool.getConnection();
  try {
    const dateInBangkok = utcToZonedTime(new Date(), "Asia/Bangkok");
    const usedate = format(dateInBangkok, 'dd MMMM yyyy');

    const query = `
      SELECT 
        b.id, 
        b.nickname, 
        b.usedate, 
        b.price, 
        b.shuttle_cock, 
        b.paymentStatus, 
        b.regisDate, 
        b.isStudent,
        pc.barcode 
      FROM 
        buffet_newbie b
      LEFT JOIN 
        pos_customers pc 
      ON 
        b.id = pc.playerId 
      AND 
        pc.buffetStatus = ?
      WHERE 
        b.usedate = ?
    `;

    const [results] = await connection.query<RowDataPacket[]>(query, [buffetStatusEnum.BUFFET_NEWBIE, usedate]);

    res.json(results);
  } catch (error) {
    console.error('Error fetching buffet data:', error);
    res.status(500).json({ error: 'Error fetching buffet data' });
  } finally {
    connection.release(); // Release the connection back to the pool when done
  }
}
