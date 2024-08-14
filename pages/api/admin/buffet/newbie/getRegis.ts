import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { format, utcToZonedTime } from 'date-fns-tz';
import { getToken } from 'next-auth/jwt';
import { buffetStatusEnum } from '@/enum/buffetStatusEnum';
import { IsStudentEnum } from '@/enum/StudentPriceEnum';
import { PaymethodShuttlecockEnum } from '@/enum/paymethodShuttlecockEnum';

const getDateInBangkok = () => {
    const dateInBangkok = utcToZonedTime(new Date(), 'Asia/Bangkok');
    return format(dateInBangkok, 'dd MMMM yyyy');
};

const buildQuery = () => `
    SELECT 
        buffet_newbie.*, 
        CASE 
            WHEN current_buffet_q.id IS NULL THEN NULL
            ELSE current_buffet_q.T_value
        END AS T_value,
        buffet_setting_newbie.shuttle_cock_price,
        buffet_setting_newbie.court_price,
        (SELECT 
            SUM(
                CASE 
                    WHEN ps.flag_delete = false 
                    THEN ps.TotalAmount 
                    ELSE 0 
                END
            ) 
         FROM pos_sales ps 
         WHERE ps.CustomerID = (SELECT pc.customerID FROM pos_customers pc WHERE pc.playerId = buffet_newbie.id AND pc.buffetStatus = '${buffetStatusEnum.BUFFET_NEWBIE}')
        ) AS pendingMoney
    FROM 
        buffet_newbie
    LEFT JOIN 
        current_buffet_q ON buffet_newbie.q_id = current_buffet_q.id 
    LEFT JOIN 
        buffet_setting_newbie ON buffet_setting_newbie.isStudent = buffet_newbie.isStudent 
    WHERE 
        buffet_newbie.usedate = ?
        AND buffet_newbie.paymethod_shuttlecock = '${PaymethodShuttlecockEnum.NONE}'
        AND paymentStatus = 0;
`;

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const token = await getToken({ req });
            if (!token) {
                return res.status(401).json({ message: 'Not authenticated' });
            }

            const connection = await pool.getConnection();
            const usedate = getDateInBangkok();
            const query = buildQuery();

            const [results] = await connection.query(query, [usedate]);
            res.json(results);
            connection.release(); // Release the connection back to the pool

        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Error fetching data' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};
