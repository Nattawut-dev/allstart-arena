import React, { useState } from 'react';
import Link from 'next/link';
import styles from './styles/Sidebar.module.css';
import { useRouter } from 'next/router';
import { FaChalkboard, FaChevronCircleRight, FaChevronCircleDown, FaCalendarPlus, FaCalendarDay, FaCalendarAlt, FaPencilAlt, FaHandPointRight, FaRegClock, FaTh, FaAngellist } from "react-icons/fa";

interface SidebarProps {
  isOpen: boolean;

}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const router = useRouter();
  const { id } = router.query
  const [selectedSubMenu1, setSelectedSubMenu1] = useState(true);
  const [selectedSubMenu2, setSelectedSubMenu2] = useState(true);
  const [selectedSubMenu3, setSelectedSubMenu3] = useState(true);



  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.menu}>
        <ul className={styles['menu-list']}>

          <Link href="/" className={styles.link} ><li className={`${styles['menu-item']} ${router.pathname === '/' ? styles.activeMenuItem : ''}`}>< FaChalkboard className='mx-1' /> <span> กฎการใช้สนาม</span> </li></Link>
          <li
            className={`${styles['menu-item']} ${router.pathname === '/booking/[id]' || router.pathname === '/reservations/[id]' || router.pathname === '/booking/Reserve/[id]' ? styles.activeMenuItem : ''}`}
            onClick={() => setSelectedSubMenu1(!selectedSubMenu1)}
          >
            {selectedSubMenu1 === true ? (
              <a> <FaChevronCircleDown /> <span style={{ marginLeft: "10px" }}>จองสนาม</span></a>
            ) : <a> <FaChevronCircleRight /> <span style={{ marginLeft: "10px" }}>จองสนาม</span></a>}
            {selectedSubMenu1 === true && (
              <ul className={styles['sub-menu']} onClick={(e) => e.stopPropagation()}>
                <Link href="/booking/0" className={styles.link} ><li className={`${styles['sub-menu-item']} ${router.pathname === '/booking/[id]' || router.pathname === '/booking/Reserve/[id]' ? styles.activeSubMenu : ''}`} ><FaCalendarPlus className='mx-1' /> <span> จองสนามแบดมินตัน</span> </li></Link>
                <Link href="/reservations/0" className={styles.link} ><li className={`${styles['sub-menu-item']} ${router.pathname === '/reservations/[id]' ? styles.activeSubMenu : ''}`} ><FaCalendarAlt className='mx-1' /> <span>ข้อมูลการจอง</span> </li></Link>
                <Link href="/booking/buffet" className={styles.link} ><li className={`${styles['sub-menu-item']} ${router.pathname === '/booking/buffet' ? styles.activeSubMenu : ''}`} ><FaCalendarPlus className='mx-1' /> <span>จองตีบุฟเฟ่ต์</span> </li></Link>
                <Link href="/booking/buffet/info" className={styles.link} ><li className={`${styles['sub-menu-item']} ${router.pathname === '/booking/buffet/info' ? styles.activeSubMenu : ''}`} ><FaCalendarPlus className='mx-1' /> <span>ข้อมูลตีบุีฟเฟ่ต์</span> </li></Link>

              </ul>
            )}
          </li>

          <li
            className={`${styles['menu-item']} ${router.pathname === '/Tournament/[id]' ? styles.activeMenuItem : ''}`}
            onClick={() => setSelectedSubMenu2(!selectedSubMenu2)}
          >
            {selectedSubMenu2 === true ? (
              <a> <FaChevronCircleDown /> <span style={{ marginLeft: "10px" }}>สมัครเข้าร่วมการแข่งขัน</span></a>
            ) : <a> <FaChevronCircleRight /> <span style={{ marginLeft: "10px" }}>สมัครเข้าร่วมการแข่งขัน</span></a>}
            {selectedSubMenu2 === true && (
              <ul className={styles['sub-menu']} onClick={(e) => e.stopPropagation()}>
                <Link href="/Tournament/0" className={styles.link} ><li className={`${styles['sub-menu-item']} ${id === '0' && router.pathname === '/Tournament/[id]' ? styles.activeSubMenu : ''}`}><FaHandPointRight className='mx-1' /> <span>มือ N</span></li></Link>
                <Link href="/Tournament/1" className={styles.link} ><li className={`${styles['sub-menu-item']} ${id === '1' && router.pathname === '/Tournament/[id]' ? styles.activeSubMenu : ''}`}><FaHandPointRight className='mx-1' /> <span>มือ S</span></li></Link>
                <Link href="/Tournament/2" className={styles.link} ><li className={`${styles['sub-menu-item']} ${id === '2' && router.pathname === '/Tournament/[id]' ? styles.activeSubMenu : ''}`}><FaHandPointRight className='mx-1' /> <span>มือ P-/P</span></li></Link>
                <Link href="/Tournament/3" className={styles.link} ><li className={`${styles['sub-menu-item']} ${id === '3' && router.pathname === '/Tournament/[id]' ? styles.activeSubMenu : ''}`}><FaHandPointRight className='mx-1' /> <span>มือ P+/C</span></li></Link>
              </ul>
            )}
          </li>
          <li
            className={`${styles['menu-item']} ${router.pathname === '/Tournament/detail/[id]' ? styles.activeMenuItem : ''}`}
            onClick={() => setSelectedSubMenu3(!selectedSubMenu3)}
          >
            {selectedSubMenu2 === true ? (
              <a> <FaChevronCircleDown /> <span style={{ marginLeft: "10px" }}>ตรวจสอบรายชื่อผู้สมัคร</span></a>
            ) : <a> <FaChevronCircleRight /> <span style={{ marginLeft: "10px" }}>ตรวจสอบรายชื่อผู้สมัคร</span></a>}
            <a></a>
            {selectedSubMenu3 === true && (
              <ul className={styles['sub-menu']} onClick={(e) => e.stopPropagation()}>
                <Link href="/Tournament/detail/0" className={styles.link} ><li className={`${styles['sub-menu-item']} ${id === '0' && router.pathname === '/Tournament/detail/[id]' ? styles.activeSubMenu : ''}`}><FaAngellist className='mx-1' /> <span>มือ N</span></li></Link>
                <Link href="/Tournament/detail/1" className={styles.link} ><li className={`${styles['sub-menu-item']} ${id === '1' && router.pathname === '/Tournament/detail/[id]' ? styles.activeSubMenu : ''}`}><FaAngellist className='mx-1' /> <span>มือ S</span></li></Link>
                <Link href="/Tournament/detail/2" className={styles.link} ><li className={`${styles['sub-menu-item']} ${id === '2' && router.pathname === '/Tournament/detail/[id]' ? styles.activeSubMenu : ''}`}><FaAngellist className='mx-1' /> <span>มือ P-/P</span></li></Link>
                <Link href="/Tournament/detail/3" className={styles.link} ><li className={`${styles['sub-menu-item']} ${id === '3' && router.pathname === '/Tournament/detail/[id]' ? styles.activeSubMenu : ''}`}><FaAngellist className='mx-1' /> <span>มือ P+/C</span></li></Link>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
