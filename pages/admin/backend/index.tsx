import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/AdminLayout';
import  Styles from '@/styles/admin/backend.module.css';
import { Container } from 'react-bootstrap';
export default function Welcome() {
    const [message, setMessage] = useState('');
    const router = useRouter();
    useEffect(() => {
        // Fetch data from the server to check if the user is authenticated
        // You can use this endpoint to verify the session and perform any other checks
        const checkAuthentication = async () => {
            try {
                const response = await fetch('/api/admin/check-auth', {
                    method: 'GET',
                    credentials: 'include', // Include cookies in the request
                });

                const data = await response.json();
                if (response.ok) {
                    setMessage(data.message);
                } else {
                    // Redirect to the login page if the user is not authenticated
                    router.push('/admin/login')
                    return;
                }
            } catch (error) {
                console.error('Error while checking authentication', error);
                setMessage('An error occurred. Please try again later.');
            }
        };

        checkAuthentication();
    }, []);

    const handleLogout = async () => {
        try {
            // Send a request to the server to clear the session (logout)
            const response = await fetch('/api/admin/logout', {
                method: 'POST',
                credentials: 'include', // Include cookies in the request
            });

            if (response.ok) {
                // Redirect to the login page after successful logout
                router.push('/admin/login');
            } else {
                setMessage('Logout failed. Please try again.');
            }
        } catch (error) {
            console.error('Error while logging out', error);
            setMessage('An error occurred. Please try again later.');
        }
    };
    if (message != "Authenticated") {
        return (
            <>
                <div style={{ top: "50%", left: "50%", position: "absolute", transform: "translate(-50%,-50%)" }}>
                    <h5 >loading....</h5>
                </div>
            </>
        );
    }
    return (
        <AdminLayout>

            <div className={Styles.Container}>
                <h1>Welcome</h1>
                <p>{message}</p>
                <button onClick={handleLogout}>Logout</button>
            </div>

        </AdminLayout>
    );
}