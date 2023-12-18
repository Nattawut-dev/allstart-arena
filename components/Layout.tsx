import React, { ReactNode, useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import styles from './styles/Layout.module.css';
import { useMediaQuery } from 'react-responsive';

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 }); // กำหนดจุด breakpoint ของมือถือ

  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, []);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.wrapper}>
      <Topbar toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />
      <div className={`${styles.contentWrapper} ${isSidebarOpen ? styles.open : ''}`}>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={styles.content}>
          {children}
          {/* {React.Children.map(children, (child:any) =>
            React.cloneElement(child, { isSidebarOpen: isSidebarOpen })
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Layout;
