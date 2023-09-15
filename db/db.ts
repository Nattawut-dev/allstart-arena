// lib/db.ts
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables from .env file
// dotenv.config();

const pool = mysql.createPool({
  connectionLimit: 10, // Optional, set the maximum number of connections in the pool
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  waitForConnections: true, // Optional, wait for available connections instead of throwing an error
  // port : 3307
    // ssl: {
    // rejectUnauthorized: true,
    // }
    
});

export default pool;
