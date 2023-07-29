import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { password } = req.body;
    console.log(password)
    try {
      // เรียกใช้ bcrypt.hash เพื่อเข้ารหัสรหัสผ่าน
      const hashedPassword = await bcrypt.hash(password, 10);

      res.status(200).json({ hashedPassword });
    } catch (err) {
      console.error('Error while hashing password', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}