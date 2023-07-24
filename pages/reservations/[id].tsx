import React, { useEffect, useState } from 'react';
import styles from '@/styles/reservation.module.css';
import { utcToZonedTime } from 'date-fns-tz';
import { format, addDays, subDays, isBefore, isAfter } from 'date-fns';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { Button, Modal } from 'react-bootstrap';

interface TimeSlot {
    id: number;
    start_time: string;
    end_time: string;
}

interface Court {
    id: number;
    title: string;
    status: number;
}

interface Reservation {
    id: number;
    name: string;
    court_id: number;
    time_slot_id: number;
    reserved_date: string;
    usedate: string;
    start_time: string;
    end_time: string;
    price: number
    status: number
}
interface Props {
    timeSlots: TimeSlot[];
    courts: Court[];
    timeZone: string;
}


export const getServerSideProps: GetServerSideProps<Props> = async () => {
    try {
        const timeZone = 'Asia/Bangkok';
        const courts = await fetch(`${process.env.HOSTNAME}/api/reserve/courts`);
        const courts_data = await courts.json();
        const timeslots = await fetch(`${process.env.HOSTNAME}/api/reserve/time-slots`);
        const timeslots_data = await timeslots.json();
        return {
            props: {
                timeSlots: timeslots_data.timeSlots,
                courts: courts_data.courts,
                timeZone: timeZone
            },

        };
    } catch (error) {
        console.error('Failed to fetch data:', error);
        return {
            props: {
                timeSlots: [],
                courts: [],
                timeZone: "Asia/Bangkok"

            },
        };
    }
}

function Schedule({ timeSlots, courts, timeZone }: Props,) {

    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [reservations1, setReservations1] = useState<Reservation>();

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const response = await fetch(`/api/reserve/reservations`);
            const data = await response.json();
            setReservations(data);
        } catch (error) {
            console.error('Failed to fetch reservations:', error);
        }
    };

    const router = useRouter();
    const dateInBangkok = utcToZonedTime(new Date(), "Asia/Bangkok");
    const parsedId = parseInt(router.query.id as string)
    const [selectedDate, setSelectedDate] = useState(addDays(dateInBangkok, parsedId));

    function setbtn(id: any) {
        fetchReservations();
        setSelectedDate(addDays(dateInBangkok, id))
        router.push(`/reservations/${encodeURIComponent(id)}`)

    }


    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setSelectedFile(file);

            // Preview the selected image
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        if (selectedFile) {
            setLoading(true);
            console.log("tstsda")
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('name', reservations1!.name);
            formData.append('court_id', court1!.id.toString());
            formData.append('startvalue', reservations1!.start_time);
            formData.append('endvalue', reservations1!.end_time);
            formData.append('usedate', reservations1!.usedate);


            try {
                const response = await fetch('/api/ReservationSlip', {
                    method: 'POST',
                    body: formData,
                });
                

                if (response.ok) {
                    setLoading(false);
                    setShow(false);
                    window.location.reload();
                } else {
                    console.error('Error:', response.statusText);
                }
            } catch (error) {
                console.error('Error:', error);
            }

        }
    };

    const [court1, setCourt1] = useState<Court>();
    const [timeSlot1, setTimeSlot1] = useState<TimeSlot>();

    const payment = (id: any) => {
        const reservation = reservations.find((r) => r.id === id);
        setReservations1(reservation)
        if (reservation) {
            const court = courts.find((c) => c.id === reservation.court_id);
            setCourt1(court)
            setShow(true);
        }
    }
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    return (
        <>
            {loading &&
                <div className={styles.loading}><div className={styles.lds_roller}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>
            }
            <div className={`${styles.container} `}>
                <h5 className={styles.title}>ตารางการจองของวันที่  {selectedDate && format(selectedDate, 'dd MMMM yyyy')}</h5>
                <div className={styles.btn_wrapper}>
                    <button className={`${styles.btn} ${parsedId == 0 ? styles.active : ''}`} onClick={() => setbtn(0)}>{format((dateInBangkok), 'dd MMMM ')}</button>
                    <button className={`${styles.btn} ${parsedId == 1 ? styles.active : ''}`} onClick={() => setbtn(1)}>{format(addDays(dateInBangkok, 1), 'dd MMMM ')}</button>
                    <button className={`${styles.btn} ${parsedId == 2 ? styles.active : ''}`} onClick={() => setbtn(2)}>{format(addDays(dateInBangkok, 2), 'dd MMMM ')}</button>
                    <button className={`${styles.btn} ${parsedId == 3 ? styles.active : ''}`} onClick={() => setbtn(3)}>{format(addDays(dateInBangkok, 3), 'dd MMMM ')}</button>
                    <button className={`${styles.btn} ${parsedId == 4 ? styles.active : ''}`} onClick={() => setbtn(4)}>{format(addDays(dateInBangkok, 4), 'dd MMMM ')}</button>
                    <button className={`${styles.btn} ${parsedId == 5 ? styles.active : ''}`} onClick={() => setbtn(5)}>{format(addDays(dateInBangkok, 5), 'dd MMMM ')}</button>
                    <button className={`${styles.btn} ${parsedId == 6 ? styles.active : ''}`} onClick={() => setbtn(6)}>{format(addDays(dateInBangkok, 6), 'dd MMMM ')}</button>
                    <button className={`${styles.btn} ${parsedId == 7 ? styles.active : ''}`} onClick={() => setbtn(7)}>{format(addDays(dateInBangkok, 7), 'dd MMMM ')}</button>
                </div>

                <div className={styles['table-container']}>
                    <table className={styles['schedule-table']}>
                        <thead>
                            <tr>
                                <th>คอร์ท</th>
                                <th>เวลาใช้สนาม</th>
                                <th>ชื่อผู้จอง</th>
                                <th>สภานะ</th>
                                <th>การจ่าย</th>

                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map((reservation) => {

                                if (format(selectedDate, 'dd MMMM yyyy') == reservation.usedate) {
                                    const court = courts.find((c) => c.id === reservation.court_id);
                                    const timeSlot = timeSlots.find((ts) => ts.id === reservation.time_slot_id);
                                    return (

                                        <tr key={reservation.id}>
                                            <td>{court?.title}</td>
                                            <td>{reservation.start_time} - {reservation.end_time}</td>
                                            <td>{reservation.name}</td>
                                            <td style={{ color: reservation.status === 1 ? 'orange' : reservation.status === 2 ? 'green' : 'red' }}>
                                                {reservation.status === 1 ? 'กำลังตรวจสอบ' : reservation.status === 2 ? 'ชำระแล้ว' : 'ยังไม่ชำระ'}
                                            </td>                                   <td>
                                                <Button variant="primary btn-sm" onClick={() => payment(reservation.id)}>L
                                                </Button></td>
                                        </tr>

                                    );
                                }
                            })}
                        </tbody>
                    </table>
                </div>

                <Modal

                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                    centered
                >
                    <Modal.Header closeButton className={`${loading ? styles.load : ''}`}>
                        <Modal.Title><h6>ข้อมูลการจอง จองใช้งานวันที่ {reservations1?.usedate}</h6></Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={`${loading ? styles.load : ''}`}>
                        <div>
                            <div className={styles.wrapper1}>
                                <div className={styles.img}><Image src={previewImage ? previewImage : '/QR1.jpg'} alt="Qrcode" width="200" height="250" /></div>
                                <div className={styles.detail}>
                                    <div className={styles.wrapper}>
                                        <p>ชื่อผู้จอง</p>
                                        <p>{reservations1?.name}</p>
                                    </div>
                                    <div className={styles.wrapper}>
                                        <p>คอร์ทที่จอง</p>
                                        <p>{court1?.title}</p>
                                    </div>
                                    <div className={styles.wrapper}>
                                        <p>วันที่ใช้สนาม</p>
                                        <p>{reservations1?.usedate}</p>
                                    </div>
                                    <div className={styles.wrapper}>
                                        <p>เวลาใช้สนาม</p>
                                        <p>{reservations1?.start_time} - {reservations1?.end_time}</p>
                                    </div>
                                    <div className={styles.wrapper}>
                                        <p>จำนวนเงินที่ต้องจ่าย</p>
                                        <p>{reservations1?.price} บาท</p>
                                    </div>
                                    <div className={styles.wrapper}>
                                        <label htmlFor="file-input" className={styles.file_input}>
                                            เลือกภาพสลิป
                                        </label>
                                        <input
                                            style={{ display: 'none' }}
                                            id="file-input"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="file-input"
                                        />
                                        <button
                                            onClick={handleUpload}
                                            disabled={!selectedFile || loading}
                                            className={`${styles.slip} ${selectedFile ? '' : styles.disabled} `}
                                            style={{ backgroundColor: loading ? 'red' : '' }}
                                        >
                                            {loading ? 'อัพโหลด...' : 'ส่งสลิป'}
                                        </button>
                                    </div>
                                    {/* <button  className={styles.slip}>แนบสลิป</button> */}
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    {/* <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
            Close
        </Button>
        <Button variant="primary" onClick={handleClose}>จ่ายแล้ว</Button>
    </Modal.Footer> */}
                </Modal>

            </div>
        </>

    );
};

export default Schedule;
