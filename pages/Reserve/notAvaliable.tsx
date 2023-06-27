import React from 'react';
import styles from '@/styles/feedback.module.css';
import Link from 'next/link';
function NotAvailable() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>คอร์ทนี้ถูกจองไปแล้ว</h1>
      <p className={styles.message}>ขออภัยสำหรับความไม่สะดวกที่เกิดขึ้น</p>
      <Link href={'/Reserve'}><button className={styles.button}>กลับสู่หน้าหลัก</button></Link>
    </div>
  );
}

export default NotAvailable;
