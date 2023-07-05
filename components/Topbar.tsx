import React, { useState } from 'react';
import Image from 'next/image';
import styles from './styles/Topbar.module.css';

type TopBarProps = {
  toggleSidebar: () => void;
};

const TopBar: React.FC<TopBarProps> = ({ toggleSidebar }) => {
  return (
    <div className={styles.topBar}>
      <button className={styles.sidebarToggle} onClick={toggleSidebar}>
        <span className={styles.sidebarToggleIcon}>&#9776;</span>
      </button>
      <div className={styles.logo}>
        <Image src="/badminton-logo.jpg" alt="Badminton Logo" width={40} height={40} />
      </div>
      <div className={styles.title}>สนามแบดมินตัน</div>
    </div>
  );
};

export default TopBar;