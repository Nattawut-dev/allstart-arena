import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req })
  if (!token) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
  }
  const connection = await pool.getConnection();

  try {
    if (req.method === 'GET') {
      const [results] = await connection.query('SELECT * FROM hand_level');
      res.status(200).json(results);
    } else if (req.method === 'POST') {
      const { name } = req.body;
      const [result] = await connection.query('INSERT INTO hand_level (name) VALUES (?)', [name]);
      res.status(201).json(result);
    } else if (req.method === 'PUT') {
      const { id, name } = req.body;
      await connection.query('UPDATE hand_level SET name = ? WHERE id = ?', [name, id]);
      const [updatedCourt] = await connection.query('SELECT * FROM cord WHERE id = ?', [id]);
      res.status(200).json(updatedCourt);
    } else if (req.method === 'DELETE') {
      const { id } = req.query;

      await connection.query('DELETE FROM hand_level WHERE id = ?', [id]);
      res.status(204).end();
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    connection.release();
  }
}
