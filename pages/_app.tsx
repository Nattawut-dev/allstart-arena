import React from 'react';
import '../styles/globals.css'; // Import global styles here
import Layout from '../components/Layout'; // Import your custom layout component
import AdminLayout from '../components/AdminLayout';

import type { AppProps } from 'next/app';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith('/admin/backend');
  const islogin = router.pathname.startsWith('/admin/login');

  return (
    <div>
      {isAdminRoute ? <AdminLayout><Component {...pageProps} /></AdminLayout> : islogin ? <Component {...pageProps} />:<Layout> <Component {...pageProps} /> </Layout>}

    </div >

    // <Layout>
    //   <Component {...pageProps} />
    // </Layout>
  );
}

export default MyApp;