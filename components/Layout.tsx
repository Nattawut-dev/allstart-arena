import React, { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import styles from './styles/Layout.module.css';
import {isMobile} from 'react-device-detect';

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.wrapper}>
      <Topbar toggleSidebar={toggleSidebar} />
      <div className={`${styles.contentWrapper} ${isSidebarOpen ? styles.open : ''}`}>
        <Sidebar isOpen={isSidebarOpen} />
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
