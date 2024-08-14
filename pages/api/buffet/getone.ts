import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { format, utcToZonedTime } from 'date-fns-tz';
import { buffetStatusEnum } from '@/enum/buffetStatusEnum';


export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const connection = await pool.getConnection()
    try {
        const {id} = req.query
        const query = `SELECT 
    b.id, 
    b.nickname, 
    b.usedate, 
    b.price, 
    b.shuttle_cock, 
    b.paymentStatus, 
    b.regisDate, 
    b.isStudent, 
    (SELECT pc.playerId FROM pos_customers pc WHERE pc.customerID = b.id) AS playerId,
    (SELECT 
        SUM(
            CASE 
                WHEN  ps.flag_delete = false 
                THEN ps.TotalAmount 
                ELSE 0 
            END
        ) 
     FROM pos_sales ps 
     WHERE ps.CustomerID = (SELECT pc.customerID FROM pos_customers pc WHERE pc.playerId = b.id AND pc.buffetStatus = '${buffetStatusEnum.BUFFET}')
    ) AS pendingMoney
FROM 
    buffet b 
WHERE 
    b.id = ? ;`;

        // Execute the SQL query to fetch time slots
        const [results] = await connection.query(query, [id]);
        
        res.json(results);
    } catch (error) {
        console.error('Error fetching :', error);
        res.status(500).json({ error: 'Error fetching ' });
    } finally {
        connection.release(); // Release the connection back to the pool when done
    }
};
