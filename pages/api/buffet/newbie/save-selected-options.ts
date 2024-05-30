import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/db';
import {  RowDataPacket } from 'mysql2'; 

interface IData {
    selected_options: any;
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const connection = await pool.getConnection()
    try {
        const sql = 'SELECT selected_options FROM current_cock_newbie ';
        const [results] = await connection.query(sql) as RowDataPacket[];
        const formattedResults = results.map((result: IData) => ({
            ...result,
            selected_options: JSON.parse(result.selected_options)
        }));
        res.json(formattedResults);
    } catch (error) {
        console.error('Error fetching :', error);   
        res.status(500).json({ error: 'Error fetching ' });
    } finally {
        connection.release(); 
    }
};
