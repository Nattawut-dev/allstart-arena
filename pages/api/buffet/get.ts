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

    // ดึง page, limit และ search จาก query
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 15;
    const offset = (page - 1) * limit;
    const search = (req.query.search as string) || '';  // ค่าของ search (ถ้ามี)

    // Query สำหรับนับจำนวนทั้งหมด
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM buffet b
      LEFT JOIN pos_customers pc ON b.id = pc.playerId AND pc.buffetStatus = ?
      WHERE b.usedate = ? 
      AND (b.nickname LIKE ? OR pc.barcode LIKE ?)  -- ค้นหาชื่อและ barcode
    `;

    // Query สำหรับดึงข้อมูลแบบ pagination
    const dataQuery = `
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
        buffet b
      LEFT JOIN 
        pos_customers pc 
      ON 
        b.id = pc.playerId 
      AND 
        pc.buffetStatus = ?
      WHERE 
        b.usedate = ?
      AND 
        (b.nickname LIKE ? OR pc.barcode LIKE ?)  -- ค้นหาชื่อและ barcode
      ORDER BY b.id ASC
      LIMIT ? OFFSET ?
    `;

    // ดึงจำนวนทั้งหมด
    const [[{ total }]] = await connection.query<RowDataPacket[]>(countQuery, [
      buffetStatusEnum.BUFFET,
      usedate,
      `%${search}%`,  // ใช้ % เพื่อค้นหาค่าที่ตรงกับคำค้นหา
      `%${search}%`,
    ]);

    // ดึงข้อมูลที่ถูกแบ่งหน้า
    const [results] = await connection.query<RowDataPacket[]>(dataQuery, [
      buffetStatusEnum.BUFFET,
      usedate,
      `%${search}%`,
      `%${search}%`,
      limit,
      offset,
    ]);

    // ส่งข้อมูลออกไป
    res.json({
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      data: results,
    });
  } catch (error) {
    console.error('Error fetching buffet data:', error);
    res.status(500).json({ error: 'Error fetching buffet data' });
  } finally {
    connection.release();
  }
}
