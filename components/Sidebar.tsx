import React, { useState } from 'react';
import Link from 'next/link';
import styles from './styles/Sidebar.module.css';
import { useRouter } from 'next/router';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const router = useRouter();
  const path = router.pathname
  const [selectedmainMenu, setSelectedmainMenu] = useState(null);
  const [selectedSubMenu1, setSelectedSubMenu1] = useState(true);
  const [selectedSubMenu2, setSelectedSubMenu2] = useState(true);
  const [selectedSubMenu3, setSelectedSubMenu3] = useState(true);




  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.menu}>
        <ul className={styles['menu-list']}>

          <Link href="/Rules" className={styles.link} ><li className={`${styles['menu-item']} ${router.pathname === '/Rules' ? styles.activeMenuItem : ''}`}>กฎการใช้สนามแบดมินตัน</li></Link>
          <li
            className={`${styles['menu-item']} ${router.pathname === '/booking/[id]' || router.pathname === '/reservations/[id]' || router.pathname === '/booking/Reserve/[id]'? styles.activeMenuItem : ''}`}
            onClick={() => setSelectedSubMenu1(!selectedSubMenu1)}
          >
            <a>จองสนามแบดมินตัน</a>
            {selectedSubMenu1 === true && (
              <ul className={styles['sub-menu']} onClick={(e) => e.stopPropagation()}>
                <Link href="/booking/0" className={styles.link} ><li className={`${styles['sub-menu-item']} ${router.pathname === '/booking/[id]' || router.pathname === '/booking/Reserve/[id]'? styles.activeSubMenu : ''}`} >จองสนามแบดมินตัน</li></Link>
                <Link href="/reservations/0" className={styles.link} ><li className={`${styles['sub-menu-item']} ${router.pathname === '/reservations/[id]' ? styles.activeSubMenu : ''}`} >ข้อมูลการจองทั้งหมด</li></Link>
              </ul>
            )}
          </li>

          <li
            className={`${styles['menu-item']} ${router.pathname === '/Reserve' || router.pathname === '/Reservetions' ? styles.activeMenuItem : ''}`}
            onClick={() => setSelectedSubMenu2(!selectedSubMenu2)}
          >
            <a>สมัครเข้าร่วมการแข่งขัน</a>
            {selectedSubMenu2 === true && (
              <ul className={styles['sub-menu']} onClick={(e) => e.stopPropagation()}>
                <Link href="/" className={styles.link} ><li className={`${styles['sub-menu-item']} ${router.pathname === '/Reserve' ? styles.activeSubMenu : ''}`}>มือ N</li></Link>
                <Link href="/" className={styles.link} ><li className={`${styles['sub-menu-item']} ${router.pathname === '/Reserve' ? styles.activeSubMenu : ''}`}>มือ S</li></Link>
                <Link href="/" className={styles.link} ><li className={`${styles['sub-menu-item']} ${router.pathname === '/Reserve' ? styles.activeSubMenu : ''}`}>มือ P-/P</li></Link>
                <Link href="/" className={styles.link} ><li className={`${styles['sub-menu-item']} ${router.pathname === '/Reserve' ? styles.activeSubMenu : ''}`}>มือ P+/C</li></Link>
              </ul>
            )}
          </li>
          <li
            className={`${styles['menu-item']} ${router.pathname === '/Reserve' || router.pathname === '/Reservetions' ? styles.activeMenuItem : ''}`}
            onClick={() => setSelectedSubMenu3(!selectedSubMenu3)}
          >
            <a>ตรวจสอบรายชื่อผู้สมัคร</a>
            {selectedSubMenu3 === true && (
              <ul className={styles['sub-menu']} onClick={(e) => e.stopPropagation()}>
                <Link href="/" className={styles.link} ><li className={`${styles['sub-menu-item']} ${router.pathname === '/Reserve' ? styles.activeSubMenu : ''}`}>มือ N</li></Link>
                <Link href="/" className={styles.link} ><li className={`${styles['sub-menu-item']} ${router.pathname === '/Reserve' ? styles.activeSubMenu : ''}`}>มือ S</li></Link>
                <Link href="/" className={styles.link} ><li className={`${styles['sub-menu-item']} ${router.pathname === '/Reserve' ? styles.activeSubMenu : ''}`}>มือ P-/P</li></Link>
                <Link href="/" className={styles.link} ><li className={`${styles['sub-menu-item']} ${router.pathname === '/Reserve' ? styles.activeSubMenu : ''}`}>มือ P+/C</li></Link>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
