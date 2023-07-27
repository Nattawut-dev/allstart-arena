
import { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from 'cloudinary';
import multiparty from 'multiparty';
import pool from '@/db/db';


// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.SECRET,
  secure: true,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new multiparty.Form();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
    const connection= await pool.getConnection()
    try {
      // Get the uploaded file from the files object
      const file = files.file[0];

      // Upload the image to Cloudinary
      const result = await cloudinary.v2.uploader.upload(file.path, {
        folder: 'upload', // Set the desired folder name
        resource_type: 'image', // Specify the resource type (image, video, raw)
      });
      const id = fields.id;
      await connection.query('UPDATE tournament SET slipurl = ? , paymentStatus = ? WHERE id = ? ', [result.secure_url,1,id]);

      // Return the Cloudinary image URL
      res.status(200).json({ imageUrl: result.secure_url });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }finally {
      connection.release(); // Release the connection back to the pool when done
    }
  });
}
