import React from 'react';
import styles from '@/styles/feedbackA.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';

function ReservationSuccess() {
  const router = useRouter();
  const {id} = router.query
  const url  = `/reservations/${id}`
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>การจองสำเร็จแล้ว</h1>
      <p className={styles.message}>ขอบคุณสำหรับการจองคอร์ท</p>
      <p className={styles.message} style={{color: "coral"}}>หากไม่ชำระเงินภายใน 15 นาที การจองจะถูกลบ</p>


      <Link href={url}>
        <button className={styles.button}>ดูรายละเอียดการจอง</button>
      </Link>
    </div>
  );
}

export default ReservationSuccess;
