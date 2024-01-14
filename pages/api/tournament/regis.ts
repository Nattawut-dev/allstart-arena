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


    const listT_id = fields.listT_id;
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
    const hand_level_id = fields.hand_level_id;
    const imageUrl1 = fields.imageUrl1;
    const imageUrl2 = fields.imageUrl2;
    const connection = await pool.getConnection()

      try {



          const insertQuery = `
                  INSERT INTO tournament (id, listT_id, Name_1, Nickname_1, age_1, gender_1, affiliation_1, tel_1, image_1, Name_2, Nickname_2, age_2, gender_2, affiliation_2, tel_2, image_2, level,  hand_level_id ,team_type)
                  VALUES ( null, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,'รอตรวจสอบ')
                `;

          await connection.query(insertQuery, [
            listT_id,
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
            hand_level_id,
          ]);

          res.status(200).json({ success: true, message: 'Data inserted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      } finally {
        connection.release(); // Release the connection back to the pool when done
      }

  });
}
