import React from 'react';
import styles from '@/styles/feedback.module.css';
import Link from 'next/link';
function NotAvailable() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>คอร์ท/บางช่วงเวลาที่ท่านเลือก ถูกจองไปแล้ว/ไม่ว่าง</h1>
      <p className={styles.message}>ขออภัยสำหรับความไม่สะดวกที่เกิดขึ้น</p>
      <Link href={'/booking/0'}><button className={styles.button}>กลับสู่หน้าหลัก</button></Link>
    </div>
  );
}

export default NotAvailable;
