import React, { useState } from 'react';
import Link from 'next/link';
import styles from './styles/admin/AdminSidebar.module.css';
import { useRouter } from 'next/router';
import { FiLogOut } from 'react-icons/fi';
import { FaChalkboard, FaChevronCircleRight, FaChevronCircleDown,FaCalendarPlus,FaCalendarDay ,FaCalendarAlt ,FaPencilAlt ,FaHandPointRight ,FaRegClock ,FaTh} from "react-icons/fa";
interface SidebarProps {
  isOpen: boolean;

}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const router = useRouter();
  const { id } = router.query
  const [selectedSubMenu1, setSelectedSubMenu1] = useState(true);
  const [selectedSubMenu2, setSelectedSubMenu2] = useState(true);
  const [selectedSubMenu3, setSelectedSubMenu3] = useState(true);
  const [message, setMessage] = useState('');

  const handleLogout = async () => {
    try {
      // Send a request to the server to clear the session (logout)
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include', // Include cookies in the request
      });

      if (response.ok) {
        // Redirect to the login page after successful logout
        router.push('/admin/login');
      } else {
        setMessage('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Error while logging out', error);
      setMessage('An error occurred. Please try again later.');
    }
  };


  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.menu}>
        <ul className={styles['menu-list']}>

          <Link href="/Rules" className={styles.link} ><li className={`${styles['menu-item']} ${router.pathname === '/Rules' ? styles.activeMenuItem : ''}`}> <FaChalkboard />  ตั้งค่ากฎ</li></Link>
          <li
            className={`${styles['menu-item']} ${router.pathname === '/booking/[id]' || router.pathname === '/reservations/[id]' || router.pathname === '/booking/Reserve/[id]' ? styles.activeMenuItem : ''}`}
            onClick={() => setSelectedSubMenu1(!selectedSubMenu1)}
          >
            {selectedSubMenu1 === true ? (
              <a> <FaChevronCircleDown /> การจองสนาม</a>
            ) : <a> <FaChevronCircleRight /> การจองสนาม</a>}

            {selectedSubMenu1 === true && (
              <ul className={styles['sub-menu']} onClick={(e) => e.stopPropagation()}>
                <Link href="/booking/0" className={styles.link} ><li className={`${styles['sub-menu-item']} ${router.pathname === '/booking/[id]' || router.pathname === '/booking/Reserve/[id]' ? styles.activeSubMenu : ''}`} > <FaCalendarPlus /> จองสนาม</li></Link>
                <Link href="/reservations/0" className={styles.link} ><li className={`${styles['sub-menu-item']} ${router.pathname === '/reservations/[id]' ? styles.activeSubMenu : ''}`} ><FaCalendarDay/> ข้อมูลการจอง</li></Link>
                <Link href="/reservations/0" className={styles.link} ><li className={`${styles['sub-menu-item']} ${router.pathname === '/reservations/[id]' ? styles.activeSubMenu : ''}`} ><FaCalendarAlt/> ข้อมูลการจองย้อนหลัง</li></Link>

              </ul>
            )}
          </li>

          <li
            className={`${styles['menu-item']} ${router.pathname === '/Tournament/[id]' ? styles.activeMenuItem : ''}`}
            onClick={() => setSelectedSubMenu2(!selectedSubMenu2)}
          >
            {selectedSubMenu2 === true ? (
              <a> <FaChevronCircleDown /> การแข่งขัน</a>
            ) : <a> <FaChevronCircleRight /> การแข่งขัน</a>}
            {selectedSubMenu2 === true && (
              <ul className={styles['sub-menu']} onClick={(e) => e.stopPropagation()}>
                <Link href="/Tournament/0" className={styles.link} ><li className={`${styles['sub-menu-item']} ${id === '0' && router.pathname === '/Tournament/[id]' ? styles.activeSubMenu : ''}`}><FaPencilAlt /> การตั้งค่า</li></Link>
                <Link href="/Tournament/0" className={styles.link} ><li className={`${styles['sub-menu-item']} ${id === '0' && router.pathname === '/Tournament/[id]' ? styles.activeSubMenu : ''}`}><FaHandPointRight /> มือ N</li></Link>
                <Link href="/Tournament/1" className={styles.link} ><li className={`${styles['sub-menu-item']} ${id === '1' && router.pathname === '/Tournament/[id]' ? styles.activeSubMenu : ''}`}><FaHandPointRight /> มือ S</li></Link>
                <Link href="/Tournament/2" className={styles.link} ><li className={`${styles['sub-menu-item']} ${id === '2' && router.pathname === '/Tournament/[id]' ? styles.activeSubMenu : ''}`}><FaHandPointRight /> มือ P-/P</li></Link>
                <Link href="/Tournament/3" className={styles.link} ><li className={`${styles['sub-menu-item']} ${id === '3' && router.pathname === '/Tournament/[id]' ? styles.activeSubMenu : ''}`}><FaHandPointRight /> มือ P+/C</li></Link>
              </ul>
            )}
          </li>
          <Link href="/Rules" className={styles.link} ><li className={`${styles['menu-item']} ${router.pathname === '/Rules' ? styles.activeMenuItem : ''}`}> <FaTh />  คอร์ท</li></Link>
          <Link href="/Rules" className={styles.link} ><li className={`${styles['menu-item']} ${router.pathname === '/Rules' ? styles.activeMenuItem : ''}`}> <FaRegClock />  เวลา</li></Link>

          <Link onClick={handleLogout} href="" className={styles.link} ><li className={`${styles['sub-menu-item']}`} ><FiLogOut /> ออกจากระบบ   </li></Link>
        </ul>

      </div>
    </div>
  );
};

export default Sidebar;
