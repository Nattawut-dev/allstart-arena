import React, { useState } from 'react';
import Image from 'next/image';
import styles from './styles/admin/AdminTopbar.module.css';
import { FaAlignLeft, FaTimes } from 'react-icons/fa';

type TopBarProps = {
  toggleSidebar: () => void;
  isOpen: boolean;

};

const TopBar: React.FC<TopBarProps> = ({ toggleSidebar, isOpen }) => {
  return (
    <div className={styles.topBar}>
      <button className={styles.sidebarToggle} onClick={toggleSidebar}>
        <span className={styles.sidebarToggleIcon}>{isOpen ? <FaTimes />:<FaAlignLeft /> }</span>
      </button>
      <div className={styles.logo}>
        <Image src="/badminton-logo.jpg" alt="Badminton Logo" width={40} height={40} />
      </div>
      <div className={styles.title}>Admin Page</div>
    </div>
  );
};

export default TopBar;