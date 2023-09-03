import { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from 'cloudinary';
import multiparty from 'multiparty';
import pool from '@/db/db';
import { RowDataPacket } from 'mysql2';

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
interface MaxTeamRow {
  max_team: string;
}
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

    const image1 = files.image_1[0];
    const image2 = files.image_2[0];
    const listT_id = fields.listT_id;
    const team_name = fields.title;
    const Name_1 = fields.Name_1;
    const Nickname_1 = fields.Nickname_1;
    const age_1 = fields.age_1;
    const gender_1 = fields.gender_1;
    const affiliation_1 = fields.affiliation_1;
    const tel_1 = fields.tel_1;
    const Name_2 = fields.Name_2;
    const Nickname_2 = fields.Nickname_2;
    const age_2 = fields.age_2;
    const gender_2 = fields.gender_2;
    const affiliation_2 = fields.affiliation_2;
    const tel_2 = fields.tel_2;
    const level = fields.level;

    const uploadResult1 = await cloudinary.v2.uploader.upload(image1.path, {
      folder: 'upload',
      resource_type: 'image',
    });

    const uploadResult2 = await cloudinary.v2.uploader.upload(image2.path, {
      folder: 'upload',
      resource_type: 'image',
    });

    const imageUrl1 = uploadResult1.secure_url;
    const imageUrl2 = uploadResult2.secure_url;
    const connection = await pool.getConnection()

    if (imageUrl1 && imageUrl2) {
      try {
        const maxTeamQuery = `
               SELECT max_team
               FROM listtournament
               WHERE id = ?;
              `;
        const [maxTeamRows] = await connection.query<RowDataPacket[]>(maxTeamQuery, [listT_id]);

        if (Array.isArray(maxTeamRows) && maxTeamRows.length > 0) {
          const max_team = maxTeamRows[0].max_team;
          const insertQuery = `
                  INSERT INTO tournament (id, listT_id, team_name, Name_1, Nickname_1, age_1, gender_1, affiliation_1, tel_1, image_1, Name_2, Nickname_2, age_2, gender_2, affiliation_2, tel_2, image_2, level, team_type)
                  SELECT null, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CASE WHEN (SELECT COUNT(*) FROM tournament WHERE team_type = 'ทีมหลัก' AND listT_id = ?) < ?
                THEN 'ทีมหลัก' ELSE 'ทีมสำรอง' END
                `;

          await connection.query(insertQuery, [
            listT_id,
            team_name,
            Name_1,
            Nickname_1,
            age_1,
            gender_1,
            affiliation_1,
            tel_1,
            imageUrl1,
            Name_2,
            Nickname_2,
            age_2,
            gender_2,
            affiliation_2,
            tel_2,
            imageUrl2,
            level,
            listT_id,
            max_team // ใช้ค่า max_team จาก query
          ]);

          res.status(200).json({ success: true, message: 'Data inserted successfully' });
        } else {
          res.status(500).json({ error: 'Failed to retrieve max_team from listtournament' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      } finally {
        connection.release(); // Release the connection back to the pool when done
      }
    } else {
      res.status(500).json({ error: 'Failed to upload images' });
    }
  });
}
