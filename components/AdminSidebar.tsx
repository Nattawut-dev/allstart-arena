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

          <Link href="/admin/backend" className={styles.link} ><li className={`${styles['sub-menu-item']} ${router.pathname === '/admin/backend' ? styles.activeMenuItem : ''}`}> <div><FaChalkboard /> <span> ตั้งค่ากฎ</span></div> </li></Link>
          <li
            className={`${styles['menu-item']} ${ router.pathname.startsWith('/admin/backend/booking/') ? styles.activeMenuItem : ''}`}
            onClick={() => setSelectedSubMenu1(!selectedSubMenu1)}
          >
            {selectedSubMenu1 === true ? (
              <a> <FaChevronCircleDown /> <span style={{marginLeft : "10px"}}>การจองสนาม</span></a>
            ) : <a> <FaChevronCircleRight /> <span style={{marginLeft : "10px"}}>การจองสนาม</span></a>}

            {selectedSubMenu1 === true && (
              <ul className={styles['sub-menu']} onClick={(e) => e.stopPropagation()}>
                <Link href="/admin/backend/booking/0" className={styles.link} ><li className={`${styles['sub-menu-item']} ${router.pathname === '/admin/backend/booking/[id]' || router.pathname === '/booking/Reserve/[id]' ? styles.activeSubMenu : ''}`} > <div><FaCalendarPlus /> <span> จองสนาม</span></div></li></Link>
                <Link href="/admin/backend/booking/holidays" className={styles.link} ><li className={`${styles['sub-menu-item']} ${router.pathname === '/admin/backend/booking/holidays' ? styles.activeSubMenu : ''}`} ><div><FaCalendarDay/> <span>วันหยุด</span> </div></li></Link>
                <Link href="/admin/backend/booking/new_reserved" className={styles.link} ><li className={`${styles['sub-menu-item']} ${router.pathname === '/admin/backend/booking/new_reserved' ? styles.activeSubMenu : ''}`} ><div><FaCalendarDay/> <span>การจองใหม่</span> </div></li></Link>
                <Link href="/reservations/0" className={styles.link} ><li className={`${styles['sub-menu-item']} ${router.pathname === '/reservations/[id]' ? styles.activeSubMenu : ''}`} ><div><FaCalendarAlt/> <span>ข้อมูลการจองย้อนหลัง</span></div></li></Link>
              </ul>
            )}
          </li>

          <li
            className={`${styles['menu-item']} ${router.pathname.startsWith('/admin/backend/tournament/') ? styles.activeMenuItem : ''}`}
            onClick={() => setSelectedSubMenu2(!selectedSubMenu2)}
          >
            {selectedSubMenu2 === true ? (
              <a>  <FaChevronCircleDown /> <span style={{marginLeft : "10px"}}>การแข่งขัน</span> </a>
            ) : <a><FaChevronCircleRight /> <span style={{marginLeft : "10px"}}></span>การแข่งขัน</a>}
            {selectedSubMenu2 === true && (
              <ul className={styles['sub-menu']} onClick={(e) => e.stopPropagation()}>
                <Link href="/admin/backend/tournament/setting" className={styles.link} ><li className={`${styles['sub-menu-item']} ${ router.pathname === '/admin/backend/tournament/setting' ? styles.activeSubMenu : ''}`}> <div><FaPencilAlt /> <span>การตั้งค่า</span></div> </li></Link>
                <Link href="/Tournament/0" className={styles.link} ><li className={`${styles['sub-menu-item']} ${id === '0' && router.pathname === '/Tournament/[id]' ? styles.activeSubMenu : ''}`}> <div><FaHandPointRight /> <span>มือ N</span></div></li></Link>
                <Link href="/Tournament/1" className={styles.link} ><li className={`${styles['sub-menu-item']} ${id === '1' && router.pathname === '/Tournament/[id]' ? styles.activeSubMenu : ''}`}> <div><FaHandPointRight /> <span>มือ S</span></div></li></Link>
                <Link href="/Tournament/2" className={styles.link} ><li className={`${styles['sub-menu-item']} ${id === '2' && router.pathname === '/Tournament/[id]' ? styles.activeSubMenu : ''}`}> <div><FaHandPointRight /> <span>มือ P-/P</span></div> </li></Link>
                <Link href="/Tournament/3" className={styles.link} ><li className={`${styles['sub-menu-item']} ${id === '3' && router.pathname === '/Tournament/[id]' ? styles.activeSubMenu : ''}`}> <div><FaHandPointRight /> <span>มือ P+/C</span></div> </li></Link>
              </ul>
            )}
          </li>
          <Link href="/Rules" className={styles.link} ><li className={`${styles['sub-menu-item']} ${router.pathname === '/Rules' ? styles.activeMenuItem : ''}`}> <div> <FaTh /> <span>คอร์ท</span></div> </li></Link>
          <Link href="/Rules" className={styles.link} ><li className={`${styles['sub-menu-item']} ${router.pathname === '/Rules' ? styles.activeMenuItem : ''}`}> <div><FaRegClock /> <span>เวลา</span></div>  </li></Link>

          <Link onClick={handleLogout} href="" className={styles.link} ><li className={`${styles['sub-menu-item']}`} > <div><FiLogOut /> <span>ออกจากระบบ</span></div>    </li></Link>
        </ul>

      </div>
    </div>
  );
};

export default Sidebar;
