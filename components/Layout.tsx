import React, { ReactNode } from 'react';
import Sidebar from './Sidebar'; // Import your navigation component
import Topbar from './Topbar'
import styles from './styles/Layout.module.css'; // Import your CSS module


type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    
    <div className={styles.container}>
      <Topbar />
      <Sidebar /> {/* Render your navigation component */}
      <main className={styles.content}>{children}</main> {/* Render the content of each page */}
      {/* Add footer, additional components, or styles here */}
    </div>
  );
};

export default Layout;