import React, { useEffect, useState } from 'react';
import styles from '@/styles/reservation.module.css';
import { utcToZonedTime } from 'date-fns-tz';
import { format, addDays } from 'date-fns';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { Button, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2'
import NotFoundPage from '../404'

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
    const [imgUrl, setImgUrl] = useState('')
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setSelectedFile(file);

            // Preview the selected image
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && typeof event.target.result === 'string') {
                    const imageUrl = event.target.result;
                    setImgUrl(imageUrl);
                }

                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    const [loading, setLoading] = useState(false);
    const confirm = () => {
        Swal.fire({
            title: `ต้องการส่งภาพสลิปนี้ ?`,
            imageUrl: imgUrl,
            imageHeight: 250,
            imageWidth: 200,
            showCancelButton: true,
            cancelButtonText: "ยกเลิก",
            confirmButtonText: 'ตกลง',

        }).then((result) => {
            if (result.isConfirmed) {
                handleUpload();
            } else {
                console.log('User canceled the action.');
            }
        })
    }

    const handleUpload = async () => {
        if (selectedFile) {

            setLoading(true);
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

                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'บันทึกสำเร็จ',
                        showConfirmButton: false,
                        timer: 1500,
                    }).then(() => {
                        window.location.reload();
                    })

                } else {
                    console.error('Error:', response.statusText);
                }
            } catch (error) {
                console.error('Error:', error);
            }

        }
    };

    const [court1, setCourt1] = useState<Court>();

    const [targetTime, setTargetTime] = useState(new Date());


    const payment = (id: any) => {
        const reservation = reservations.find((r) => r.id === id);
        setReservations1(reservation)
        if (reservation) {
            if (reservation.status === 0) {
                const targetTime = new Date(reservation.reserved_date);
                setTargetTime(targetTime)
            }
            const court = courts.find((c) => c.id === reservation.court_id);
            setCourt1(court)
            setShow(true);
        }

    }
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false)
    };


    const countdownMinutes = 15;

    const UseCountdown = (targetTime: Date, countdownMinutes: number) => {
        const [remainingTime, setRemainingTime] = useState(() => {
            const currentTime = new Date();
            const timeDifference = targetTime.getTime() - currentTime.getTime();
            return timeDifference < 0 ? 0 : timeDifference;
        });

        useEffect(() => {
            const intervalId = setInterval(() => {
                const currentTime = new Date();
                const timeDifference = targetTime.getTime() - currentTime.getTime();
                setRemainingTime(timeDifference < 0 ? 0 : timeDifference);
            }, 1000);

            return () => clearInterval(intervalId);
        }, [targetTime]);

        const countdownTime = countdownMinutes * 60 * 1000;
        const totalRemainingTime = remainingTime + countdownTime;

        const minutesRemaining = Math.floor((totalRemainingTime / 1000 / 60) % 60);
        const secondsRemaining = Math.floor((totalRemainingTime / 1000) % 60);

        return { minutesRemaining, secondsRemaining };
    };



    const { minutesRemaining, secondsRemaining } = UseCountdown(targetTime, countdownMinutes);

    if (timeSlots.length < 1 || courts.length < 1) {

        return (
            <NotFoundPage />
        );
    }
    return (
        <>
            {loading &&
                <div>
                    <div>

                    </div>
                    <div className={styles.loading}>
                        <p>กำลังโหลด...</p>
                        <div className={styles.lds_roller}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>
                </div>

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
                                <th>#</th>
                                <th>คอร์ท</th>
                                <th>เวลาใช้สนาม</th>
                                <th>ชื่อผู้จอง</th>
                                <th>สถานะ</th>
                                <th>ชำระเงิน</th>

                            </tr>
                        </thead>
                        <tbody>
                            {reservations
                                .filter(item => item.usedate === format(selectedDate, 'dd MMMM yyyy'))
                                .map((reservation, index) => {
                                    const court = courts.find((c) => c.id === reservation.court_id);
                                    const timeSlot = timeSlots.find((ts) => ts.id === reservation.time_slot_id);
                                    return (

                                        <tr key={reservation.id}>
                                            <td>{index + 1}</td>
                                            <td>{court?.title}</td>
                                            <td>{reservation.start_time} - {reservation.end_time}</td>
                                            <td>{reservation.name}</td>



                                            <td className='' style={{ backgroundColor: reservation.status === 1 ? '#FDCE4E' : reservation.status === 2 ? '#d1e7dd' : '#eccccf' }}>
                                                {reservation.status === 1 ? 'กำลังตรวจสอบ' : reservation.status === 2 ? 'ชำระแล้ว' : 'ยังไม่ชำระ'}
                                            </td>                                   <td>
                                                <Button className={styles.btnPay} variant="primary btn-sm " onClick={() => payment(reservation.id)}>ชำระ</Button></td>
                                        </tr>
                                    );
                                })}
                            {reservations.filter(item => item.usedate === format(selectedDate, 'dd MMMM yyyy')).length === 0 &&
                                <tr>
                                    <td colSpan={6}>ยังไม่มีการจอง</td>
                                </tr>
                            }
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
                                <div className={styles.img}>
                                    <Image src={previewImage ? previewImage : '/QR5.jpg'} alt="Qrcode" width="200" height="250" />
                                    {
                                        previewImage == null &&
                                        <div className={styles.payment}>
                                            <div className={styles.wrapper4}>
                                                <p>พร้อมเพย์ :</p>
                                                <p>0987022613</p>
                                            </div>
                                            <div className={styles.wrapper4}>
                                                <p>ชื่อบัญชี :</p>
                                                <p>ณัฐวุฒิ กายชาติ</p>
                                            </div>
                                        </div>
                                    }
                                </div>
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
                                    <h4 style={{ textAlign: "center" }}>
                                        ทั้งหมด <span style={{ color: 'red' }}>{reservations1?.price}</span> บาท
                                    </h4>
                                    {reservations1?.status === 0 && (
                                        <div>
                                            {minutesRemaining > 0 && (
                                                <div style={{ textAlign: "center" }}>
                                                    <h6>
                                                        <span >กรุณาชำระเงินภายใน </span>
                                                        <span style={{ color: 'red' }} >
                                                            <span>{minutesRemaining.toString().padStart(2, '0')}:{secondsRemaining.toString().padStart(2, '0')}</span>
                                                        </span>
                                                        <span> นาที </span>
                                                    </h6>
                                                </div>
                                            )}

                                            {minutesRemaining < 0 && (
                                                <div style={{ textAlign: "center" }}>
                                                    <div><h5>   <span style={{ color: 'red' }}>ข้อมูลถูกลบแล้วกรุณาจองใหม่</span></h5></div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {reservations1?.status !== 0 && (
                                        <div style={{ textAlign: "center" }}>
                                            {reservations1?.status === 1 && (
                                                <div><h5> สถานะ  <span style={{ color: 'orange' }}>กำลังตรวจสอบสลิป</span></h5></div>

                                            )}
                                            {reservations1?.status === 2 && (

                                                <div><h5> สถานะ   <span style={{ color: 'green' }}>ชำระเงินสำเร็จ</span></h5></div>

                                            )}
                                        </div>

                                    )}





                                    {/* <button  className={styles.slip}>แนบสลิป</button> */}
                                </div>
                            </div>

                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className={styles.footer1}>
                            <div className={styles.btn1}><Button className='btn-info '><a href="/QR5.jpg" download="QR.jpg">โหลดสลิป</a></Button></div>
                            <div className={styles.slipbtn}>
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
                                    onClick={confirm}
                                    disabled={!selectedFile || loading}
                                    className={`${styles.slip} ${selectedFile ? '' : styles.disabled} `}
                                    style={{ backgroundColor: loading ? 'red' : '' }}
                                >
                                    {loading ? 'อัพโหลด...' : 'ส่งสลิป'}
                                </button>
                            </div>

                        </div>
                    </Modal.Footer>
                </Modal>

            </div>
        </>

    );
};

export default Schedule;
