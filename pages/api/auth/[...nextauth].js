import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import pool from '@/db/db';
import bcrypt from 'bcryptjs';

const connection = await pool.getConnection()

export const authOptions = {

    session: {
        strategy: 'jwt',
        maxAge: 8 * 60 * 60 // 8 hours
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied
                const { username, password } = credentials
                const [user] = await connection.query('SELECT * FROM users WHERE username = ?', [username]);
                if (user.length > 0) {
                    const userData = user[0];
                    const passwordsMatch = await bcrypt.compare(password, userData.password); // ใช้ bcryptjs เพื่อตรวจสอบรหัสผ่าน
                    if (passwordsMatch) {
                        return true
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }

            }
        })
    ],
    pages: {
        // signIn: '/admin/login',
        error: '/error',

    },
    callbacks: {
        session({ session, token, user }) {
            return session // The return type will match the one returned in `useSession()`
        },

    },
    secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions);