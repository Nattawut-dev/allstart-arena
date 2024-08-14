import { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from 'cloudinary';
import multiparty from 'multiparty';
import pool from '@/db/db';
import { format, utcToZonedTime } from 'date-fns-tz';
import { ResultSetHeader } from 'mysql2';
import { buffetStatusEnum } from '@/enum/buffetStatusEnum';
import { generateUniqueBarcode } from '@/lib/genBarcode';
import { paymentStatusEnum } from '@/enum/paymentStatusEnum';
import { FIRST_BARCODE } from '@/constant/firstBarcode';
import { customerPaymentStatusEnum } from '@/enum/customerPaymentStatusEnum';

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
            if (req.method == 'PUT') {
                const file = files.file[0];
                const id = fields.id;



                // Upload the image to Cloudinary
                const result = await cloudinary.v2.uploader.upload(file.path, {
                    folder: 'upload', // Set the desired folder name
                    resource_type: 'image', // Specify the resource type (image, video, raw)
                });

                if (result.secure_url) {

                    try {

                        // await connection.query(`
                        //         UPDATE pos_sales
                        //         SET paymentStatus = ${paymentStatusEnum.Paid}
                        //         WHERE CustomerID = ?
                        //     `, [id]);

                        await connection.query(`
                                UPDATE pos_customers
                                SET paymentStatus = '${customerPaymentStatusEnum.CHECKING}', paymentSlip = ?
                                WHERE CustomerID = ?
                            `, [result.secure_url ,id]);


                        return res.status(200).json({ message: 'success' });


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