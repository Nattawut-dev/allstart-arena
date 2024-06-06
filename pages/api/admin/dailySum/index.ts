import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { format, utcToZonedTime } from 'date-fns-tz';
import { getToken } from 'next-auth/jwt';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const connection = await pool.getConnection();
    const token = await getToken({ req })
    if (!token) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
    }
    try {
        const dateInBangkok = utcToZonedTime(new Date(), "Asia/Bangkok");
        let today = format(dateInBangkok, 'dd MMMM yyyy');
        const { selectedValue } = req.query
        let query = '';
        const queryParams = []; // Array to hold parameters for the query
        if (typeof (selectedValue) == 'string') {
            for (let i = 0; i < parseInt(selectedValue); i++) {
                query += `
                    SELECT ? AS date_selected,
                    COALESCE((SELECT SUM(price) FROM reserve  WHERE pay_date = ? AND status != 0), 0) AS sum_reserve,
                    COALESCE((SELECT SUM(price) FROM tournament WHERE pay_date = ? AND paymentStatus != 0), 0) AS sum_tournament,
                    COALESCE((SELECT SUM(price) FROM buffet WHERE pay_date = ? ), 0) AS sum_buffet,
                    COALESCE((SELECT SUM(price) FROM buffet  WHERE pay_date = ? AND paymentStatus != 0 AND paymethod_shuttlecock = 2), 0) AS sum_buffet_cash,
                    COALESCE((SELECT SUM(price) FROM buffet  WHERE pay_date = ? AND paymentStatus != 0 AND (paymethod_shuttlecock = 1 OR paymethod_shuttlecock = 3)), 0) AS sum_buffet_tranfer,
                    COALESCE((SELECT COUNT(id) FROM buffet WHERE usedate = ? AND paymentStatus = 0),0)  AS sum_buffet_notPay,
                    (COALESCE((SELECT SUM(price) FROM reserve  WHERE pay_date = ? AND status != 0), 0) +
                    COALESCE((SELECT SUM(price) FROM tournament WHERE pay_date = ? AND paymentStatus != 0), 0) +
                    COALESCE((SELECT SUM(price) FROM buffet WHERE pay_date = ? AND paymentStatus != 0), 0)) AS total_sum
                `;

                if (i < parseInt(selectedValue) - 1) {
                    query += ' UNION';
                }

                // Add parameters for each query round
                const formattedDate = format(dateInBangkok, 'dd MMMM yyyy');
                for (let j = 0; j < 10; j++) {
                    queryParams.push(formattedDate);
                }

                dateInBangkok.setDate(dateInBangkok.getDate() - 1);
                today = format(dateInBangkok, 'dd MMMM yyyy');
            }

            // Execute the SQL query to fetch time slots
            const [results] = await connection.query(query, queryParams);
            res.json(results);

        }else{
            res.status(401).json({ error: 'Error fetching' });

        }

    } catch (error) {
        console.error('Error fetching:', error);
        res.status(500).json({ error: 'Error fetching' });
    } finally {
        connection.release(); // Release the connection back to the pool when done
    }
};
