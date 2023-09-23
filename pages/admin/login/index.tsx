import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/admin/login.module.css'

// export async function getServerSideProps() {
//     try {
//         const response = await fetch(`${process.env.HOSTNAME}/api/admin/check-auth`, { method: 'GET' });
//         if (response.redirected) {
//             return {
//                 redirect: {
//                     destination: response.url,
//                     permanent: false,
//                 },
//             };
//         }else {
//             return {
//                 redirect: {
//                     destination: `${process.env.HOSTNAME}/admin/backend`,
//                     permanent: false,
//                 },
//             };
//         }
//     } catch (error) {
//         console.error('Error while checking authentication', error);
//     }
// }
export async function getServerSideProps({ req }: any) {
    const token = req.cookies.token;
    // Get the session token from the request cookies

    if (!token) {
        return {
            props: {

            }
        }
    } else {
        return {
            redirect: {
                destination: '/admin/backend',
                permanent: false,
            },
        };

    }
}

export default function Login() {

    const router = useRouter()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                // Redirect to the welcome page after successful login
                router.push('/admin/backend');
                // window.location.href = '/admin/welcome';
            } else {
                setMessage('Login failed. Please check your username and password.');
            }
        } catch (error) {
            console.error('Error while logging in', error);
            setMessage('An error occurred. Please try again later.');
        }
    };


    const checkAuthentication = async () => {
        const response = await fetch(`/api/admin/check-auth`, { method: 'GET' });

        console.log(response.redirected)

    };

    useEffect(() => {
        checkAuthentication();
    }, []);

    return (
        <div className={styles.loginContainer}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
