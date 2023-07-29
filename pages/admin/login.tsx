import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/admin/login.module.css'
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
                router.push('/admin/welcome');
                // window.location.href = '/admin/welcome';
            } else {
                setMessage('Login failed. Please check your username and password.');
            }
        } catch (error) {
            console.error('Error while logging in', error);
            setMessage('An error occurred. Please try again later.');
        }
    };

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
