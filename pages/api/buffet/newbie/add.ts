import { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from 'cloudinary';
import multiparty from 'multiparty';
import pool from '@/db/db';
import { format, utcToZonedTime } from 'date-fns-tz';

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

                const query = `INSERT INTO buffet_newbie (nickname, usedate, phone ,isStudent ) VALUES (?, ?, ? , ?)`;
                // Execute the SQL query to insert data
                const [results] = await connection.query(query, [nickname, usedate, phone , isStudent]);

                // Check if the results contain any data to determine success
                if ((results as any).affectedRows > 0) {
                    res.status(200).json({ success: true, message: 'Data inserted successfully' });
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

                        await connection.query(`
                        UPDATE buffet_newbie AS b
                        JOIN (
                            SELECT 
                                bs.shuttle_cock_price, 
                                bs.court_price, 
                                CASE
                                    WHEN b.isStudent = 1 THEN ((b.shuttle_cock * (bs.shuttle_cock_price / 4)))
                                    ELSE (bs.court_price + (b.shuttle_cock * (bs.shuttle_cock_price / 4)))
                                END AS total_shuttle_cock
                            FROM 
                                buffet_setting_newbie bs
                            JOIN 
                                buffet_newbie b ON b.id = ?
                            WHERE 
                                bs.id = 1
                            GROUP BY 
                                bs.shuttle_cock_price, 
                                bs.court_price
                        ) AS subquery ON b.id = ?
                        SET 
                            b.paymentSlip = ?, 
                            b.price = subquery.total_shuttle_cock,
                            b.paymentStatus = 1,
                            b.pay_date = ?,
                            b.paymethod_shuttlecock = 3;
                        `,
                            [id, id, result.secure_url, today]);
                        return res.status(200).json({ imageUrl: result.secure_url });


                    } catch {
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