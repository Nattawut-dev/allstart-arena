import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { getToken } from 'next-auth/jwt';
import { buffetStatusEnum } from '@/enum/buffetStatusEnum';
import { RowDataPacket } from 'mysql2';

export default async function getBuffetById(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const token = await getToken({ req });
    if (!token) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    const connection = await pool.getConnection();
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ message: 'Missing buffet ID' });
        }

        const query = `
        SELECT 
            b.*, 
            ROUND(bs.court_price, 2) AS court_price,
    
            COALESCE(SUM(pos_sales.TotalAmount), 0) AS shoppingMoney,
    
            (
                COALESCE((
                    SELECT (SUM(bsh.quantity * st.price) / 4 ) + bs.court_price
                    FROM buffet_shuttlecocks bsh
                    JOIN shuttlecock_types st ON bsh.shuttlecock_type_id = st.id
                    WHERE bsh.buffet_id = b.id
                ), bs.court_price)
                +
                COALESCE((
                    SELECT SUM(
                        CASE 
                            WHEN ps.flag_delete = false THEN ps.TotalAmount
                            ELSE 0
                        END
                    )
                    FROM pos_sales ps
                    WHERE ps.CustomerID = (
                        SELECT pc.customerID
                        FROM pos_customers pc
                        WHERE pc.playerId = b.id 
                        AND pc.buffetStatus = '${buffetStatusEnum.BUFFET}'
                        LIMIT 1
                    )
                ), 0)
            ) AS total_price,
    
            COALESCE((
                SELECT (SUM(bs.quantity * st.price) / 4)
                FROM buffet_shuttlecocks bs
                JOIN shuttlecock_types st ON bs.shuttlecock_type_id = st.id
                WHERE bs.buffet_id = b.id
            ), 0) AS shuttlecock_total_price,
    
            (
                SELECT 
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'shuttlecock_type_id', bs.shuttlecock_type_id,
                            'shuttlecock_type', st.name,
                            'price', st.price,
                            'quantity', bs.quantity
                        )
                    )
                FROM buffet_shuttlecocks bs
                JOIN shuttlecock_types st ON bs.shuttlecock_type_id = st.id
                WHERE bs.buffet_id = b.id
            ) AS shuttlecock_details
    
        FROM buffet b
        JOIN buffet_setting bs ON bs.isStudent = b.isStudent
        LEFT JOIN pos_sales ON pos_sales.CustomerID = (
            SELECT pc.customerID
            FROM pos_customers pc
            WHERE pc.playerId = b.id AND pc.buffetStatus = '${buffetStatusEnum.BUFFET}'
            LIMIT 1
        )
        WHERE b.id = ?
        GROUP BY b.id
    `;

        const [results] = await connection.query<RowDataPacket[]>(query, [id]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Buffet not found' });
        }

        // ต้อง parse shuttlecock_details ถ้า database ส่งมาเป็น string
        const result = results[0];
        if (typeof result.shuttlecock_details === 'string') {
            try {
                result.shuttlecock_details = JSON.parse(result.shuttlecock_details);
            } catch (err) {
                console.error('Failed to parse shuttlecock_details:', err);
                result.shuttlecock_details = [];
            }
        }

        res.json({ data: result });


    } catch (error) {
        console.error('Error fetching buffet by ID:', error);
        res.status(500).json({ error: 'Error fetching buffet by ID' });
    } finally {
        connection.release();
    }
}
