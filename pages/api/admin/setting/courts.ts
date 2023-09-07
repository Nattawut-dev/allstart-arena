import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sessionToken = req.cookies.sessionToken;

  if (!sessionToken) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }
  const connection = await pool.getConnection();

  try {
    if (req.method === 'GET') {
      const [results] = await connection.query('SELECT * FROM cord');
      res.status(200).json(results);
    } else if (req.method === 'POST') {
      const { title } = req.body;

      const [result] = await connection.query('INSERT INTO cord (title, status) VALUES (?, ?)', [title, 1]);
      res.status(201).json(result);
    } else if (req.method === 'PUT') {
      const { id, title, status } = req.body;

      await connection.query('UPDATE cord SET title = ?, status = ? WHERE id = ?', [title, status, id]);
      const [updatedCourt] = await connection.query('SELECT * FROM cord WHERE id = ?', [id]);
      res.status(200).json(updatedCourt);
    } else if (req.method === 'DELETE') {
      const { id } = req.query;

      await connection.query('DELETE FROM cord WHERE id = ?', [id]);
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
