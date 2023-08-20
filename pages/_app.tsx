import React, { useEffect, useState } from 'react';
import '../styles/globals.css'; // Import global styles here
import Layout from '../components/Layout'; // Import your custom layout component
import AdminLayout from '../components/AdminLayout';

import type { AppProps } from 'next/app';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [message, setMessage] = useState('');

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

  useEffect(() => {
    checkAuthentication();
  }, [message]);

  const isAdminRoute = router.pathname.startsWith('/admin/backend');
  const islogin = router.pathname.startsWith('/admin');

  return (
    <div>
      {isAdminRoute && message === "Authenticated" ? <AdminLayout><Component {...pageProps} /></AdminLayout> : islogin ? <Component {...pageProps} /> : <Layout> <Component {...pageProps} /> </Layout>}

    </div >

    // <Layout>
    //   <Component {...pageProps} />
    // </Layout>
  );
}

export default MyApp;