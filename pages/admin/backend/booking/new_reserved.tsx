import { differenceInCalendarDays, format } from 'date-fns';
import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from '@/styles/admin/reserved/new_reserved.module.css'
import Swal from 'sweetalert2'
import useCountdown from '../../../countdown';


interface Reserve {
    id: number;
    name: string;
    phone: number;
    court_id: number;
    time_slot_id: number;
    reserved_date: string;
    usedate: string;
    start_time: string;
    end_time: string;
    price: number;
    status: number;
    slip: string;
}

interface Court {
    id: number;
    title: string;
    status: number;
}



function holiday() {
    const [reserve, setreserve] = useState<Reserve[]>([])
    const [courts, setCourts] = useState<Court[]>([])
    const [selectcourt, setSelectCourt] = useState<Court>()

    const [editreserve, setEditreserve] = useState<Reserve | null>(null);
    const [reservations1, setReservations1] = useState<Reserve>();

    const [filter, setFilter] = useState<string>("transferred");

    const [isreserve, setIsreserve] = useState(false);


    const [id2, setID2] = useState(0);
    const [title2, setTitle2] = useState('');
    const [timebetween2, setTimebetween2] = useState('');
    const [location2, setLocation2] = useState('');
    const [ordinal2, setOrdinal2] = useState(0);

    const [status, setStatus] = useState(1);

    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);

    const [selectedOption, setSelectedOption] = useState(0); // State to track the selected option

    const [name, setName] = useState<string>('');
    const [selectedCourtID, setselectedCourtID] = useState<number>(0);
    const [useDate, setUseDate] = useState<string>('');
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const [price, setPrice] = useState<number>(0);

    const [ischange, setIschange] = useState(false);


    const [targetTime, setTargetTime] = useState(new Date());
    const countdownMinutes = 15;
    const { minutesRemaining, secondsRemaining } = useCountdown(targetTime, countdownMinutes);



    const handleOptionChange = async (event: React.ChangeEvent<HTMLInputElement>) => {

        const value = parseInt(event.target.value)
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
        if (event) {
            try {
                const response = await fetch('/api/admin/reserved/new/updateStatus', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: reservations1?.id, newStatus: value }),
                });

                if (!response.ok) {

                    Toast.fire({
                        icon: 'error',
                        title: 'เกิดข้อผิดพลาด'
                    })
                    throw new Error('An error occurred while updating the data.');
                }

                setSelectedOption(value);


                Toast.fire({
                    icon: 'success',
                    title: 'แก้ไขสถานะเรียบร้อย'
                })
                getReserve(status);
            } catch (error: any) {
                console.error(error.message);
                // Handle any error or display an error message
            }
        }


    };
    useEffect(() => {
        getReserve(1);
        getCourt();
    }, []);


    const getReserve = async (status: number) => {
        try {
            const response = await fetch(`/api/admin/reserved/new/get?status=${status}`);
            setStatus(status);
            const data = await response.json();
            if (response.ok) {
                setreserve(data);
                setIsreserve(true);
            } else {
                setIsreserve(false);
            }
        } catch {
            console.log('error');
        }
    };
    const getCourt = async () => {
        try {
            const courts = await fetch(`/api/reserve/courts`);
            const courts_data = await courts.json();
            setCourts(courts_data.courts);
        } catch {
            alert("error")
        }

    }


    const [loading, setLoading] = useState(false);


    const deletereserve = async (item: Reserve) => {
        Swal.fire({
            title: `ต้องการลบการจอง? `,
            text: `การจองของ ${item.name} ของวันที่ ${item.usedate} เวลาใช้สนาม ${item.start_time}  - ${item.end_time}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`/api/admin/reserved/delete?id=${item.id}`, {
                        method: 'DELETE',
                    });

                    if (!response.ok) {
                        throw new Error('An error occurred while deleting the data.');
                    } else {
                        setShow(false);
                        Swal.fire(
                            'Deleted!',
                            `ลบ การจองของ ${item.name} ของวันที่ ${item.usedate} เวลาใช้สนาม ${item.start_time}  - ${item.end_time} เรียบร้อย`,
                            'success'
                        )
                    }

                    // Update the local state to remove the deleted holiday
                    setreserve((prevreserve) =>
                        prevreserve.filter((reserve) => reserve.id !== item.id)
                    );
                } catch (error: any) {
                    console.error(error.message);
                    // Handle any error or display an error message
                }

            }
        })

    };

    const editSelecter = (item: Reserve) => {
        if (item.status === 0) {
            const targetTime = new Date(item.reserved_date);
            setTargetTime(targetTime)
        }
        setEditreserve(item);
        const findCourt = courts.find((c) => c.id === item.court_id);
        setSelectCourt(findCourt);
        setName(item.name);
        if (findCourt) {
            setselectedCourtID(findCourt?.id);
        }
        setUseDate(item.usedate);
        setStartTime(item.start_time);
        setEndTime(item.end_time);
        setPrice(item.price);
        setShow2(true);
    }

    async function updateHoliday() {
        try {
            const response = await fetch(`/api/admin/reserve/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id2,
                    title: title2,
                    ordinal: ordinal2,
                    location: location2,
                    timebetween: timebetween2
                }),
            });

            if (!response.ok) {
                throw new Error('An error occurred while updating the data.');
            }
            Swal.fire({
                icon: 'success',
                title: 'สำเร็จ',
                text: 'แก้ไขสำเร็จ',
            })

            setTitle2('');
            setOrdinal2(0);
            setLocation2('');
            setTimebetween2('');
            setShow2(false);
            getReserve(status);
        } catch (error) {
            console.error('An error occurred while updating the data:', error);
            throw error;
        }
    }
    const checkslip = async (item: Reserve) => {

        if (item) {
            setReservations1(item)
            setSelectedOption(item.status);
            const findCourt = courts.find((c) => c.id === item.court_id);
            setSelectCourt(findCourt)
            setName(item.name);
            if (findCourt) {
                setselectedCourtID(findCourt?.id);
            }
            setUseDate(item.usedate);
            setStartTime(item.start_time);
            setEndTime(item.end_time);
            setPrice(item.price);
        }

    }

    const showslip = () => {
        Swal.fire({
            imageUrl: reservations1?.slip, // Replace with your image URL
            imageAlt: 'Image Alt Text',
            showCloseButton: true,
            focusConfirm: false,
            title: `${reservations1?.price} บาท`,
            confirmButtonText: 'Close',
        });
    }

    const isChange = () => {
        if (reservations1?.name != name ||
            reservations1.usedate != useDate ||
            reservations1.start_time != startTime ||
            reservations1.end_time != endTime ||
            reservations1.price != price ||
            reservations1.court_id != selectedCourtID) {
            return true;
        }
    }

    const handleTimeSlotChange = (value: string) => {
        const intValue = parseInt(value)
        setselectedCourtID(intValue)
    };

    const CourtOption = courts.map((court) => {

        return (
            <option
                key={court.id}
                value={court.id}
            >
                {court.title}
            </option>
        );
    });
    if (!isreserve) {
        return (
            <div>No reserve</div>
        )
    }

    return (
        <>

            <div className={styles.container}>

                <div className={styles.box}>
                    <h5 className='fw-bold'>ตรวจสอบการโอนเงิน</h5>
                    <div className='d-flex justify-content-end mb-2'>
                        <Button
                            onClick={() => {
                                setFilter('Checked');
                                getReserve(2);
                            }}
                            style={{
                                backgroundColor: filter === 'Checked' ? 'blue' : 'white',
                                color: filter === 'Checked' ? 'white' : 'black',
                            }}
                        >
                            ตรวจสอบแล้ว
                        </Button>
                        <Button
                            className='mx-2'
                            onClick={() => {
                                setFilter('transferred');
                                getReserve(1);
                            }}
                            style={{
                                backgroundColor: filter === 'transferred' ? 'green' : 'white',
                                color: filter === 'transferred' ? 'white' : 'black',
                            }}
                        >
                            โอนแล้ว
                        </Button>
                        <Button
                            onClick={() => {
                                setFilter('notTransferred');
                                getReserve(0);
                            }}
                            style={{
                                backgroundColor: filter === 'notTransferred' ? 'red' : 'white',
                                color: filter === 'notTransferred' ? 'white' : 'black',
                            }}
                        >
                            ยังไม่โอน
                        </Button>
                    </div>
                    <table className="table table-bordered table-striped">
                        <thead >
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">คอร์ท</th>
                                <th scope="col">ชื่อ</th>
                                <th scope="col">เบอร์โทร</th>
                                <th scope="col">วันใช้คอร์ท</th>
                                <th scope="col">เวลาใช้สนาม</th>
                                <th scope="col">ราคารวม</th>
                                <th scope="col">สถานะ</th>
                                <th scope="col">สลิป/แก้ไข</th>
                                <th scope="col">ลบ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reserve.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.court_id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.phone}</td>
                                    <td>{item.usedate}</td>
                                    <td>{item.start_time} - {item.end_time}</td>
                                    <td>{item.price}</td>
                                    <td className='' style={{ backgroundColor: item.status === 1 ? '#FDCE4E' : item.status === 2 ? '#d1e7dd' : '#eccccf' }}>
                                        {item.status === 1 ? 'ตรวจสอบ' : item.status === 2 ? 'ชำระแล้ว' : 'ยังไม่ชำระ'}
                                    </td>
                                    <td><Button className="btn-sm" onClick={() => { checkslip(item); setShow(true); }}>สลิป/แก้ไข</Button></td>

                                    {/* <td>
                                        <div className={styles.switch}>
                                            <input
                                                type="checkbox"
                                                id={`${item.id}`}
                                                checked={item.status === 1}
                                                onChange={() => handleCheckboxChange(item.id, item.status)}
                                            />
                                            <label htmlFor={`${item.id}`}>Toggle</label>
                                        </div>
                                    </td> */}

                                    <td>
                                        <Button
                                            className="btn-sm btn-danger"
                                            onClick={() => deletereserve(item)}
                                        >
                                            ลบ
                                        </Button></td>

                                </tr>
                            ))}


                        </tbody>
                    </table>


                </div>

            </div>
            <Modal

                show={show}
                onHide={() => setShow(false)}
                backdrop={true}
                keyboard={false}
                centered
                animation={false}
                size='lg'
            >
                <Modal.Header closeButton >
                    <Modal.Title><h6>ข้อมูลการจอง จองใช้งานวันที่ {reservations1?.usedate}</h6></Modal.Title>
                </Modal.Header>
                <Modal.Body className={`${loading ? styles.load : ''}`}>
                    <div>
                        <div className={styles.wrapper1}>
                            <div className={styles.img}>
                                <button onClick={() => { showslip() }}><img src={reservations1?.slip === null ? '/No_image_available.png' : reservations1?.slip} alt="Qrcode" width="200" height="250" /></button>
                                <div className={styles.payment}>
                                    <h4>{price} <span>บาท</span></h4>
                                </div>
                            </div>

                            <div className={styles.detail}>
                                <div className={styles.wrapper}>
                                    <p>ชื่อผู้จอง</p>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className={styles.wrapper}>
                                    <p>คอร์ทที่จอง</p>
                                    <select className={styles.select} value={selectedCourtID} onChange={(e) => handleTimeSlotChange(e.target.value)}>
                                    
                                        {CourtOption}
                                    </select>
                                    {/* <input
                                        type="text"
                                        value={selectedCourtID}
                                        onChange={(e) => setselectedCourtID(e.target.value)}
                                    /> */}
                                </div>
                                <div className={styles.wrapper}>
                                    <p>วันที่ใช้สนาม</p>
                                    <input
                                        type="text"
                                        value={useDate}
                                        onChange={(e) => setUseDate(e.target.value)}
                                    />
                                </div>
                                <div className={styles.wrapper}>
                                    <p>เวลาใช้สนาม</p>
                                    <input
                                        type="text"
                                        value={`${startTime} - ${endTime}`}
                                        onChange={(e) => {
                                            const [newStartTime, newEndTime] = e.target.value.split(' - ');
                                            setStartTime(newStartTime);
                                            setEndTime(newEndTime);
                                        }}
                                    />
                                </div>
                                <div className={styles.wrapper}>
                                    <p>ราคา</p>
                                    <input
                                        className={styles.numberInput}
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(parseFloat(e.target.value))}
                                    />
                                </div>

                                {/* <div><h5> สถานะ </h5></div> */}
                                <div className={styles.container_radio}>
                                    <div className={styles.wrapper_radio}>
                                        <label className={`${styles.option} ${selectedOption === 0 ? styles.checked : ''}`}>
                                            <input
                                                style={{ display: "none" }}
                                                type="radio"
                                                value={0}
                                                id="option-0"
                                                checked={selectedOption === 0}
                                                onChange={handleOptionChange}
                                            />
                                            <div className={styles.dot}>
                                                <div className={styles.innerDot}></div>
                                            </div>
                                            <span>ยังไม่แนบสลิป</span>
                                        </label>

                                        <label className={`${styles.option} ${selectedOption === 1 ? styles.checked : ''}`}>
                                            <input
                                                style={{ display: "none" }}
                                                type="radio"
                                                value={1}
                                                id="option-1"
                                                checked={selectedOption === 1}
                                                onChange={handleOptionChange}
                                            />
                                            <div className={styles.dot}>
                                                <div className={styles.innerDot}></div>
                                            </div>
                                            <span>กำลังตรวจสอบ</span>
                                        </label>

                                        <label className={`${styles.option}  ${selectedOption === 2 ? styles.checked2 : ''}`}>
                                            <input
                                                style={{ display: "none" }}

                                                type="radio"
                                                value={2}
                                                id="option-2"
                                                checked={selectedOption === 2}
                                                onChange={handleOptionChange}
                                            />
                                            <div className={styles.dot}>
                                                <div className={styles.innerDot}></div>
                                            </div>
                                            <span>ตรวจสอบแล้ว</span>

                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </Modal.Body>
                <Modal.Footer>

                    <div className={styles.footer1}>
                        <div className={styles.btn1}><Button onClick={() => deletereserve(reservations1!)} className='btn btn-danger'>ลบข้อมูล</Button></div>
                        <div className={styles.slipbtn}>
                            <Button onClick={() => editSelecter} disabled={!isChange()} className='btn btn-success mx-2'>บันทึก</Button>
                            <Button onClick={() => setShow(false)} className='btn btn-secondary'>Close</Button>
                        </div>



                    </div>



                </Modal.Footer>
            </Modal>

            <Modal show={show2} onHide={() => setShow2(false)} centered>
                <Modal.Header closeButton className={`${loading ? styles.load : ''}`}>
                    <Modal.Title><h6>ข้อมูลการจอง จองใช้งานวันที่ {editreserve?.usedate}</h6></Modal.Title>
                </Modal.Header>
                <Modal.Body className={`${loading ? styles.load : ''}`}>
                    <div>
                        <div className={styles.wrapper1}>
                            <div className={styles.img}>
                                <img src={editreserve?.slip === null ? '/No_image_available.png' : '/QR5.jpg'} alt="Qrcode" width="200" height="250" />

                            </div>
                            <div className={styles.detail}>
                                <div className={styles.wrapper}>
                                    <p>ชื่อผู้จอง</p>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className={styles.wrapper}>
                                    <p>คอร์ทที่จอง</p>
                                    <input
                                        type="text"
                                        value={selectedCourtID}
                                        onChange={(e) => setselectedCourtID(e.target.value)}
                                    />
                                </div>
                                <div className={styles.wrapper}>
                                    <p>วันที่ใช้สนาม</p>
                                    <input
                                        type="text"
                                        value={useDate}
                                        onChange={(e) => setUseDate(e.target.value)}
                                    />
                                </div>
                                <div className={styles.wrapper}>
                                    <p>เวลาใช้สนาม</p>
                                    <input
                                        type="text"
                                        value={`${startTime} - ${endTime}`}
                                        onChange={(e) => {
                                            const [newStartTime, newEndTime] = e.target.value.split(' - ');
                                            setStartTime(newStartTime);
                                            setEndTime(newEndTime);
                                        }}
                                    />
                                </div>
                                <div className={styles.wrapper}>
                                    <p>ราคา</p>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(parseFloat(e.target.value))}
                                    />
                                </div>

                                {editreserve?.status === 0 && (
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

                                {editreserve?.status !== 0 && (
                                    <div style={{ textAlign: "center" }}>
                                        {editreserve?.status === 1 && (
                                            <div><h5> สถานะ  <span style={{ color: 'orange' }}>กำลังตรวจสอบสลิป</span></h5></div>

                                        )}
                                        {editreserve?.status === 2 && (

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
                    {/* <div className={styles.footer1}>

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

                    </div> */}
                </Modal.Footer>
            </Modal>
        </>

    )
}

export default holiday