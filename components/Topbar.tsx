import React from 'react'
import styles from './styles/Topbar.module.css'; // Import your CSS module
import{FaAtlassian } from 'react-icons/fa';
function Topbar() {
  return (
    <div className={styles.topBar}>
      <h1 className={styles.h1}><FaAtlassian /> Badminton</h1>
    </div>
  );
}

export default  Topbar