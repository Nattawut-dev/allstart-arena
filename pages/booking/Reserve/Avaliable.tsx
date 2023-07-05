import React from 'react';
import styles from '@/styles/feedbackA.module.css';
import Link from 'next/link';

function ReservationSuccess() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>การจองสำเร็จแล้ว</h1>
      <p className={styles.message}>ขอบคุณสำหรับการจองคอร์ท</p>
      <Link href="/reservations/0">
        <button className={styles.button}>ดูรายละเอียดการจอง</button>
      </Link>
    </div>
  );
}

export default ReservationSuccess;
