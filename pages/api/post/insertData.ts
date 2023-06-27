import mysql from 'mysql2/promise';

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
});

export default async function insertData(name: string, coverimage: string, detail: string) {
  try {
    await connection.query('INSERT INTO reserve (name, phone) VALUES (?, ?, ?==)', [
      name,
      detail,
      coverimage,
    ]);
    return {
      success: true,
      message: 'Data inserted successfully',
    };
  } catch (error) {
    return {
      success: false,
      //   message: error.message
    };
  }
}
