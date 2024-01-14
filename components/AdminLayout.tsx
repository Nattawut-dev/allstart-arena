import React, { ReactNode, useEffect, useState } from 'react';
import Sidebar from './AdminSidebar';
import Topbar from './AdminTopbar';
import styles from './styles/admin/AdminLayout.module.css';
import { useMediaQuery } from 'react-responsive';

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 }); // กำหนดจุด breakpoint ของมือถือ
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, []);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.wrapper}>
      <Topbar toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />
      <div className={`${styles.contentWrapper} ${isSidebarOpen ? styles.open : ''}`}>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
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


