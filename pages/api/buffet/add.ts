import { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from 'cloudinary';
import multiparty from 'multiparty';
import pool from '@/db/db';
import { format, utcToZonedTime } from 'date-fns-tz';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { buffetStatusEnum } from '@/enum/buffetStatusEnum';
import { FIRST_BARCODE } from '@/constant/firstBarcode';
import { customerPaymentStatusEnum } from '@/enum/customerPaymentStatusEnum';
import { buffetPaymentStatusEnum } from '@/enum/buffetPaymentStatusEnum';
import { PayByEnum } from '@/enum/payByEnum';

// Configure Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.SECRET,
});

export const config = {
    api: {
        bodyParser: false,
    },
};



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const connection = await pool.getConnection();

    try {
        const form = new multiparty.Form();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Server error' });
                return;
            }
            if (req.method == 'POST') {
                const nickname = fields.nickname;
                const usedate = fields.usedate;
                const phone = fields.phone;
                const isStudent = fields.isStudent;

                const query = `INSERT INTO buffet (nickname, usedate, phone ,isStudent ) VALUES (?, ?, ? , ?)`;
                // Execute the SQL query to insert data
                const [results] = await connection.query<ResultSetHeader>(query, [nickname, usedate, phone, isStudent]);


                // Check if the results contain any data to determine success
                if (results.affectedRows > 0) {

                    const barcode = FIRST_BARCODE;
                    const insertCustomerQuery = `INSERT INTO pos_customers ( PlayerId,phone , CustomerName, buffetStatus, barcode) 
                    SELECT 
                    ?, 
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
                    const [insertCustomerResults] = await connection.query<ResultSetHeader>(insertCustomerQuery, [results.insertId, phone, nickname, buffetStatusEnum.BUFFET]);
                    if (insertCustomerResults.affectedRows > 0) {

                        const query = `SELECT barcode from pos_customers WHERE customerID = ?`
                        const [barcode] = await connection.query<RowDataPacket[]>(query, [insertCustomerResults.insertId]);

                        res.status(200).json({ barcode: barcode[0], success: true, message: 'Data inserted successfully' });

                    } else {
                        res.status(500).json({ success: false, message: 'Error inserting data' });
                    }
                } else {
                    res.status(500).json({ success: false, message: 'Error inserting data' });
                }
            } else if (req.method == 'PUT') {
                const file = files.file[0];
                const id = fields.id;



                // Upload the image to Cloudinary
                const result = await cloudinary.v2.uploader.upload(file.path, {
                    folder: 'upload', // Set the desired folder name
                    resource_type: 'image', // Specify the resource type (image, video, raw)
                });

                if (result.secure_url) {
                    const dateInBangkok = utcToZonedTime(new Date(), "Asia/Bangkok");
                    const today = format(dateInBangkok, 'dd MMMM yyyy')
                    try {
                        const buffetUpdateQuery = `
                        SELECT 
                          bs.shuttle_cock_price, 
                          bs.court_price, 
                          ROUND(
                              (bs.court_price + (b.shuttle_cock * (bs.shuttle_cock_price / 4))),
                              2
                          ) AS total_shuttle_cock
                        FROM 
                          buffet_setting bs
                        JOIN 
                          buffet b ON b.id = ?
                        WHERE 
                          bs.isStudent = b.isStudent
                        GROUP BY 
                          bs.shuttle_cock_price, 
                          bs.court_price
                      `;

                        const [buffetUpdateResult] = await connection.query<RowDataPacket[]>(buffetUpdateQuery, [id]);

                        if (buffetUpdateResult.length === 0) {
                            return res.status(400).json({ error: "No buffet settings found for the given buffet." });
                        }

                        const totalShuttleCock = buffetUpdateResult[0].total_shuttle_cock;

                        const buffetUpdate = `
                        UPDATE buffet
                        SET 
                          paymentSlip = ?, 
                          price = ?, 
                          paymentStatus = '${buffetPaymentStatusEnum.CHECKING}',
                          pay_date = ?,
                          paymethod_shuttlecock = 3
                        WHERE id = ?
                      `;

                        await connection.query(buffetUpdate, [result.secure_url, totalShuttleCock, today, id]);

                        await connection.query(`
                            UPDATE pos_customers
                            SET paymentStatus = '${customerPaymentStatusEnum.CHECKING}', 
                            paymentSlip = ?, 
                            courtPrice = ?,
                            pay_by = ?
                            WHERE CustomerID = (
                              SELECT pc.customerID 
                              FROM pos_customers pc 
                              WHERE pc.playerId = ? 
                              AND buffetStatus = '${buffetStatusEnum.BUFFET}'
                            )
                          `, [result.secure_url, totalShuttleCock, PayByEnum.TRANSFER, id]);

                        return res.status(200).json({ imageUrl: result.secure_url });

                    } catch (error) {
                        console.error('Error flagging sale as deleted:', error);

                        return res.status(500).json({ error: 'Server error' });
                    }
                } else {
                    return res.status(500).json({ error: 'Failed to upload image to Cloudinary' });
                }
            }
            else {
                res.status(405).json({ error: 'Method not allowed' });
                return;
            }



        })

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error inserting data' });
    } finally {
        connection.release();
    }
}