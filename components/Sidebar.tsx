import React, { useState, useEffect } from 'react';
import styles from './styles/Nav.module.css';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [selectedSubMenu, setSelectedSubMenu] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust the breakpoint as needed
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const toggleSubMenu = (subMenu: any) => {
    setSelectedSubMenu(selectedSubMenu === subMenu ? null : subMenu);
  };

  useEffect(() => {
    if (isMobile) {
      setIsSidebarVisible(true); // Show sidebar on mobile by default
    }
  }, [isMobile]);

  return (
    <div className={styles.sidebar}>
      {isMobile && (
        <>
          <button className={styles['toggle-button']} onClick={toggleSidebar}>
          <FontAwesomeIcon icon={isSidebarVisible ? faTimes : faBars} />
           
          </button>
          {isSidebarVisible && (
             <ul className={styles['menu-list']}>
             <Link href={'/'} className={styles.link}> <li className={styles['menu-item']}> หน้าแรก </li></Link>
             <Link href={'/Rules'} className={styles.link}> <li className={styles['menu-item']}> กฎการใช้สนามแบดมินตัน </li></Link>
             <Link href={'/Reserve'} className={styles.link}> <li className={styles['menu-item']}> จองสนามแบดมินตัน </li></Link>
             <Link href={'/Reservations'} className={styles.link}> <li className={styles['menu-item']}> ข้อมูลการจองทั้งหมด </li></Link>

             <li
               className={`${styles['menu-item']} ${selectedSubMenu === 'menu-item-3' ? styles['menu-item-active'] : ''}`}
               onClick={() => toggleSubMenu('menu-item-3')}
             >
               <a>สมัครเข้าร่วมการแข่งขัน</a>
               {selectedSubMenu === 'menu-item-3' && (
                 <ul className={styles['sub-menu']} onClick={(e) => e.stopPropagation()}>
                   <Link href={'/Tournament/handN'} className={styles.link}>
                     <li className={`${styles['sub-menu-item']} ${selectedSubMenu === 'submenu-item-1' ? styles['sub-menu-item-active'] : ''}`}> มือ N </li>
                   </Link>
                   <Link href={'/'} className={styles.link}>
                     <li className={`${styles['sub-menu-item']} ${selectedSubMenu === 'submenu-item-1' ? styles['sub-menu-item-active'] : ''}`}> มือ S </li>
                   </Link>
                   <Link href={'/'} className={styles.link}>
                     <li className={`${styles['sub-menu-item']} ${selectedSubMenu === 'submenu-item-1' ? styles['sub-menu-item-active'] : ''}`}> มือ P-/P </li>
                   </Link>
                   <Link href={'/'} className={styles.link}>
                     <li className={`${styles['sub-menu-item']} ${selectedSubMenu === 'submenu-item-1' ? styles['sub-menu-item-active'] : ''}`}> มือ P+/C </li>
                   </Link>
                   
                 </ul>
               )}
             </li>
             <Link href={'/Tournament'} className={styles.link}> <li className={styles['menu-item']}> ตรวจสอบรายชื่อผู้สมัคร </li></Link>
           </ul>
          )}
        </>
      )}
      {!isMobile && (
        <>
          <ul className={styles['menu-list']}>
            <Link href={'/'} className={styles.link}> <li className={styles['menu-item']}> หน้าแรก </li></Link>
            <Link href={'/Rules'} className={styles.link}> <li className={styles['menu-item']}> กฎการใช้สนามแบดมินตัน </li></Link>
            <Link href={'/Reserve'} className={styles.link}> <li className={styles['menu-item']}> จองสนามแบดมินตัน </li></Link>
            <Link href={'/Reservations'} className={styles.link}> <li className={styles['menu-item']}> ข้อมูลการจองทั้งหมด </li></Link>

            <li
              className={`${styles['menu-item']} ${selectedSubMenu === 'menu-item-3' ? styles['menu-item-active'] : ''}`}
              onClick={() => toggleSubMenu('menu-item-3')}
            >
              <a>สมัครเข้าร่วมการแข่งขัน</a>
              {selectedSubMenu === 'menu-item-3' && (
                <ul className={styles['sub-menu']} onClick={(e) => e.stopPropagation()}>
                  <Link href={'/Tournament/HandN'} className={styles.link}>
                    <li className={`${styles['sub-menu-item']} ${selectedSubMenu === 'submenu-item-1' ? styles['sub-menu-item-active'] : ''}`}> มือ N </li>
                  </Link>
                  <Link href={'/'} className={styles.link}>
                    <li className={`${styles['sub-menu-item']} ${selectedSubMenu === 'submenu-item-1' ? styles['sub-menu-item-active'] : ''}`}> มือ S </li>
                  </Link>
                  <Link href={'/'} className={styles.link}>
                    <li className={`${styles['sub-menu-item']} ${selectedSubMenu === 'submenu-item-1' ? styles['sub-menu-item-active'] : ''}`}> มือ P-/P </li>
                  </Link>
                  <Link href={'/'} className={styles.link}>
                    <li className={`${styles['sub-menu-item']} ${selectedSubMenu === 'submenu-item-1' ? styles['sub-menu-item-active'] : ''}`}> มือ P+/C </li>
                  </Link>
                  
                </ul>
              )}
            </li>
            <Link href={'/Tournament'} className={styles.link}> <li className={styles['menu-item']}> ตรวจสอบรายชื่อผู้สมัคร </li></Link>
          </ul>
          {!isSidebarVisible && (
            <button className={`${styles['toggle-button']} ${styles['show-sidebar-button']}`} onClick={toggleSidebar}>
              Show Sidebar
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Sidebar;
