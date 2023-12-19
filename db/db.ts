// db/db.ts
import mysql from 'mysql2/promise';



const pool = mysql.createPool({
  connectionLimit: 10, // Optional, set the maximum number of connections in the pool
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  waitForConnections: true, // Optional, wait for available connections instead of throwing an error
  ssl: {
    rejectUnauthorized: true,
  }

});

export default pool;
