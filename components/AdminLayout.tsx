import React, { ReactNode, useState, useEffect } from 'react';
import Sidebar from './AdminSidebar';
import Topbar from './AdminTopbar';
import styles from './styles/admin/AdminLayout.module.css';
import { useRouter } from 'next/router';

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  useEffect(() => {
    setIsSidebarOpen(window.innerWidth >= 768);
  }, []);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.wrapper}>
      <Topbar toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />
      <div className={`${styles.contentWrapper} ${isSidebarOpen ? styles.open : ''}`}>
        <Sidebar isOpen={isSidebarOpen} />
        <div className={styles.content}>
          <div className={styles.box}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;


