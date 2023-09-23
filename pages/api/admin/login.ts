
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2';
import { sign } from 'jsonwebtoken'; // For generating session tokens
import { serialize } from 'cookie';

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  // ssl: {
  // rejectUnauthorized: true,
  // }
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    try {
      connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
          console.error('Error while fetching user', err);
          res.status(500).json({ message: 'Internal server error' });
        } else {
          if ((results as any).length === 0) {
            res.status(401).json({ message: 'Invalid username or password' });
          } else {
            const user = (results as any)[0];
            bcrypt.compare(password, user.password, (bcryptErr, bcryptResult) => {
              if (bcryptErr) {
                console.error('Error while comparing passwords', bcryptErr);
                res.status(500).json({ message: 'Internal server error' });
              } else {
                if (bcryptResult) {
                  if (user.isAdmin === 0) {
                    // Generate a session token (you can customize the payload as needed)
                    const token = sign({ userId: user.id }, '123456', { expiresIn: '10h' });
                    // Set the token in a secure HTTP-only cookie
                    // res.setHeader('Set-Cookie', `sessionToken=${token}; HttpOnly; Secure; SameSite=Strict`);

                    const expirationDate = new Date();
                    expirationDate.setTime(expirationDate.getTime() + 10 * 60 * 60 * 1000); // 10 hours

                    // Cookie options
                    const cookieOptions = {
                      httpOnly: true, // Don't allow JavaScript access to the cookie
                      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
                      expires: expirationDate, // Set the expiration date
                      sameSite: 'strict' as const, // Specify the SameSite policy
                      path: '/', // Specify the path for the cookie
                    };

                    // Serialize and set the cookie
                    const sessionCookie = serialize('token', token, cookieOptions);
                    res.setHeader('Set-Cookie', sessionCookie);

                    // res.setHeader('Set-Cookie', serialize('token', token, { path: '/' }));
                    res.status(200).json({ message: 'Login success as Admin' });
                  } else {
                    res.status(403).json({ message: 'Unauthorized access' });
                  }
                } else {
                  res.status(401).json({ message: 'Invalid username or password' });
                }
              }
            });
          }
        }
      })

    } catch (err) {
      console.error('Error while processing login request', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
