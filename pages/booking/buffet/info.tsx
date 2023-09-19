import React, { useCallback, useEffect, useState } from 'react';
import { format, addDays } from 'date-fns';
import Image from 'next/image';
import { Button, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2'
import Head from 'next/head';
import styles from '@/styles/infoBuffet.module.css'
import { utcToZonedTime } from 'date-fns-tz';

interface buffet {
    id: number;
    name: string;
    nickname: string;
    usedate: string;
    phone: string;
    price: string;
    shuttle_cock: number;
    paymentStatus: number;
    paymentSlip: string;
    regisDate: string
}

function infobuffet() {
    const [buffets, setBuffets] = useState<buffet[]>([]);
    const dateInBangkok = utcToZonedTime(new Date(), "Asia/Bangkok");

    const fetchbuffet = async () => {
        try {
            const res = await fetch(`/api/buffet/get`)
            const data = await res.json()
            if (res.ok) {
                setBuffets(data)
            } else {
                Swal.fire({
                    title: 'เกิดข้อผิดพลาด',
                    icon: 'error',
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }

    }
    useEffect(() => {
        fetchbuffet();
    }, [])
    // -------------------------------------------------------------------------------------------------------------------
    return (
        <>
            <div className={styles.container}>
                <Head>
                    <title>ข้อมูลตีบุีฟเฟ่ต์</title>
                </Head>

                <h5 className={styles.title}>ข้อมูลการจองตีบุ๊ฟเฟต์ วันที่ <span style={{ color: 'red' }}>{format(dateInBangkok, 'dd MMMM yyyy')}</span></h5>
                <div className={styles['table-container']}>
                    <table className={styles['schedule-table']}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>ชื่อ</th>
                                <th>ชื่อเล่น</th>
                                <th>สถานะ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {buffets
                                .map((buffet, index) => {
                                    return (
                                        <tr key={buffet.id}>
                                            <td>{index + 1}</td>
                                            <td>{buffet.name}</td>
                                            <td>{buffet.nickname}</td>
                                            <td className='' style={{ backgroundColor: buffet.paymentStatus === 0 ? '#FDCE4E' : buffet.paymentStatus === 1 ? '#d1e7dd' : '#eccccf' }}>
                                                {buffet.paymentStatus === 0 ? 'กำลังตรวจสอบ' : buffet.paymentStatus === 1 ? 'ชำระแล้ว' : 'ยังไม่ชำระ'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            {buffets.length === 0 &&
                                <tr>
                                    <td colSpan={6}>ยังไม่มีการจอง</td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>

            </div>
        </>

    );
};

export default infobuffet;
