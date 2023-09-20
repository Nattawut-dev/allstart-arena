import { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from 'cloudinary';
import multiparty from 'multiparty';
import pool from '@/db/db';

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
            if (req.method !== 'POST') {
                res.status(405).json({ error: 'Method not allowed' });
                return;
            }

            const file = files.paymentimg[0];

            const result = await cloudinary.v2.uploader.upload(file.path, {
                folder: 'upload', // Set the desired folder name
                resource_type: 'image', // Specify the resource type (image, video, raw)
            });

            const name = fields.name;
            const nickname = fields.nickname;
            const usedate = fields.usedate;
            const phone = fields.phone;
            const price = fields.price;
            if (result.secure_url) {
                const query = `INSERT INTO buffet (name, nickname, usedate, phone, price, paymentSlip) VALUES (?, ?, ?, ?, ?, ?)`;
                // Execute the SQL query to insert data
                const [results] = await connection.query(query, [name, nickname, usedate, phone, price, result.secure_url]);

                // Check if the results contain any data to determine success
                if ((results as any).affectedRows > 0) {
                    res.status(200).json({ success: true, message: 'Data inserted successfully' });
                } else {
                    res.status(500).json({ success: false, message: 'Error inserting data' });
                }
            } else {
                res.status(500).json({ error: 'Failed to upload image to Cloudinary' });
                return;
            }
        })

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error inserting data' });
    } finally {
        connection.release(); // Release the connection back to the pool when done
    }
}