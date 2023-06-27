import { NextApiRequest, NextApiResponse } from 'next';
import insertData from './insertData';

export default async function handleAPIRequest(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { name, coverimage, detail } = req.query;

  try {
    const result = await insertData(name as string, coverimage as string, detail as string);
    res.status(200).json(result); // Send a success response to the client
  } catch (error) {
    res.status(500).json({ success: false,  }); // Send an error response to the client
  }
}