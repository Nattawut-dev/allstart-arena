import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
                    if (data.message == "Authenticated") {
                        router.push('/admin/backend')

                    }

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

    return (
        <>
            <div style={{ top: "50%", left: "50%" ,position:"absolute" , transform : "translate(-50%,-50%)"}}>
                <h5 >redirecting....</h5>
            </div>
        </>
    );
}