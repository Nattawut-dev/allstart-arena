import { differenceInCalendarDays, format } from 'date-fns';
import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from '@/styles/admin/reserved/new_reserved.module.css'
import Swal from 'sweetalert2'


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




function holiday() {
    const [reserve, setreserve] = useState<Reserve[]>([])
    const [editholiday, setEditholiday] = useState<Reserve | null>(null);
    const [detail, setDetail] = useState<Reserve | null>(null);

    const [filter, setFilter] = useState<string>("transferred");

    const [isreserve, setIsreserve] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const [title, setTitle] = useState('');
    const [timebetween, setTimebetween] = useState('');
    const [location, setLocation] = useState('');
    const [ordinal, setOrdinal] = useState(0);
    const [max_team, setMax_team] = useState(0);

    const [id2, setID2] = useState(0);
    const [title2, setTitle2] = useState('');
    const [timebetween2, setTimebetween2] = useState('');
    const [location2, setLocation2] = useState('');
    const [ordinal2, setOrdinal2] = useState(0);
    const [max_team2, setMax_team2] = useState(0);


    const [status, setStatus] = useState(1);

    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);


    useEffect(() => {
        getReserve(1);
    }, []);


    const getReserve = async (status: number) => {
        try {
            const response = await fetch(`/api/admin/reserved/new/get?status=${status}`);
            setStatus(status)
            const data = await response.json();
            if (data.length >= 1) {
                setreserve(data);
                setIsreserve(true)
            } else {
                setIsreserve(false)
            }
        } catch {
            console.log('error');
        }
    };
    const [loading, setLoading] = useState(false);


    const handleCheckboxChange = async (id: number, currentStatus: number) => {
        const newStatus = currentStatus === 1 ? 0 : 1;
        const checkIf1 = reserve.find(reserve => reserve.status === 1);
        if (checkIf1 && newStatus != 0) {
            Swal.fire({
                icon: 'error',
                title: 'ข้อผิดพลาด',
                text: 'สามารถเปิดได้แค่ครั้งละ 1 การแข่งเท่านั้น',
            })
            return;
        }
        try {
            const response = await fetch('/api/admin/reserve/statusUpdate', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id, newStatus: newStatus }),
            });

            if (!response.ok) {
                throw new Error('An error occurred while updating the data.');
            }

            // Update the local state immediately after the checkbox is clicked
            setreserve((prevreserve) =>
                prevreserve.map((reserve) =>
                    reserve.id === id ? { ...reserve, status: newStatus } : reserve
                )
            );
        } catch (error: any) {
            console.error(error.message);
            // Handle any error or display an error message
        }
    };
    console.log(reserve)
    const deletereserve = async (id: number, title: string, location: string, ordinal: number) => {
        Swal.fire({
            title: `ต้องการลบ? `,
            text: `รายการ ${title} สถานที่ ${location} ครั้งที่ ${ordinal}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`/api/admin/reserve/delete?id=${id}`, {
                        method: 'DELETE',
                    });

                    if (!response.ok) {
                        throw new Error('An error occurred while deleting the data.');
                    } else {
                        Swal.fire(
                            'Deleted!',
                            `ลบ รายการ ${title} สถานที่ ${location} ครั้งที่ ${ordinal} เรียบร้อย`,
                            'success'
                        )
                    }

                    // Update the local state to remove the deleted holiday
                    setreserve((prevreserve) =>
                        prevreserve.filter((reserve) => reserve.id !== id)
                    );
                } catch (error: any) {
                    console.error(error.message);
                    // Handle any error or display an error message
                }

            }
        })

    };

    const handleAddreserve = async () => {
        if (title == '') {
            Swal.fire({
                icon: 'error',
                title: 'กรอกหัวข้อ',
                text: 'กรุณากรอกหัวข้อ',
            })
            return;
        }

        try {

            const response = await fetch('/api/admin/reserve/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, ordinal, location, timebetween, max_team }),
            });

            if (!response.ok) {
                Swal.fire({
                    icon: 'error',
                    title: 'มีข้อผิดพลาด',
                    text: 'กรุณาลองใหม่อีกครั้ง',
                })
                throw new Error('Failed to add the data.');
            }

            // Reset the state and close the modal after successful addition
            Swal.fire({
                icon: 'success',
                title: 'สำเร็จ',
                text: 'เพิ่มการแข่งขันสำเร็จ',
            })
            setTitle('');
            setOrdinal(0);
            setTimebetween('');
            setLocation('');
            setTitle('');
            setMax_team(0)
            setShow(false);
            getHoliday();

        } catch (error) {
            console.error('An error occurred while adding the data:', error);
            // Handle any error or display an error message
        }
    };
    const editSelecter = (item: Reserve) => {
        setTitle2(item.title);
        setID2(item.id);
        setLocation2(item.location);
        setOrdinal2(item.ordinal);
        setTimebetween2(item.timebetween);
        setMax_team2(item.max_team)
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
            setMax_team2(0)
            setShow2(false);
            getReserve(status);

        } catch (error) {
            console.error('An error occurred while updating the data:', error);
            throw error;
        }
    }

    if (!isreserve) {
        return (
            <div>No reserve</div>
        )
    }

    return (
        <>

            <div className={styles.container}>

                <div className={styles.box}>
                    <h5 className='fw-bold'>จัดการ รายการแข่งขัน</h5>
                    <div className='d-flex justify-content-end mb-2'>
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
                                <th scope="col">รายละเอียด</th>
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
                                            className="btn-sm"
                                            onClick={() => {
                                                setDetail(item)
                                            }}
                                        >
                                            รายละเอียด
                                        </Button>
                                    </td>
                                    <td>
                                        <Button
                                            className="btn-sm btn-danger"
                                            onClick={() => deletereserve(item.id, item.title, item.location, item.ordinal)}
                                        >
                                            ลบ
                                        </Button></td>

                                </tr>
                            ))}


                        </tbody>
                    </table>

                    <div className='d-flex justify-content-end'> <Button onClick={() => setShow(true)}>เพิ่มงานแข่ง</Button></div>

                </div>

            </div>

            <Modal show={show} onHide={() => setShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>เพิ่มงานแข่ง</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={styles.addreserve}>
                        <div className='d-flex flex-column'>
                            <label htmlFor="title" className='mb-2'>ชื่อ</label>
                            <input
                                type="text"
                                id='title'
                                placeholder='ชื่องานแข่ง'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className='d-flex flex-column'>
                            <label htmlFor="location" className='mb-2'>สถานที่</label>
                            <input
                                type="text"
                                id='location'
                                placeholder='สถานที่'
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                        <div className='d-flex flex-column'>
                            <label htmlFor="timebetween" className='mb-2'>วันจัด-วันสิ้นสุด</label>
                            <input
                                type="text"
                                id='timebetween'
                                placeholder='วันที่เริ่ม-วันที่สิ้นสุด'
                                value={timebetween}
                                onChange={(e) => setTimebetween(e.target.value)}
                            />
                        </div>
                        <div className='d-flex flex-column'>
                            <label htmlFor="ordinal" className='mb-2'>ครั้งที่</label>
                            <input
                                type="number"
                                id="ordinal"
                                value={ordinal}
                                onChange={(e) => setOrdinal(parseInt(e.target.value))}
                            />
                        </div>
                        <div className='d-flex flex-column'>
                            <label htmlFor="max_team" className='mb-1'>จำนวนทีม</label>
                            <input
                                type="number"
                                id="max_team"
                                value={max_team}
                                onChange={(e) => setMax_team(parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div>
                        <Button onClick={handleAddreserve}>ยืนยัน</Button>
                    </div>
                    <div>
                        <Button className='btn-danger' onClick={() => setShow(false)}>ยกเลิก</Button>
                    </div>
                </Modal.Footer>
            </Modal>

            <Modal show={show2} onHide={() => setShow2(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>แก้ไขงานแข่ง'</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={styles.addreserve}>
                        <div className='d-flex flex-column'>
                            <label htmlFor="title" className='mb-1'>ชื่อ</label>
                            <input
                                type="text"
                                id='title'
                                placeholder='ชื่องานแข่ง'
                                value={title2}
                                onChange={(e) => setTitle2(e.target.value)}
                            />
                        </div>
                        <div className='d-flex flex-column'>
                            <label htmlFor="location" className='mb-1'>สถานที่</label>
                            <input
                                type="text"
                                id='location'
                                placeholder='สถานที่'
                                value={location2}
                                onChange={(e) => setLocation2(e.target.value)}
                            />
                        </div>
                        <div className='d-flex flex-column'>
                            <label htmlFor="timebetween" className='mb-1'>วันจัด-วันสิ้นสุด</label>
                            <input
                                type="text"
                                id='timebetween'
                                placeholder='วันที่เริ่ม-วันที่สิ้นสุด'
                                value={timebetween2}
                                onChange={(e) => setTimebetween2(e.target.value)}
                            />
                        </div>
                        <div className='d-flex flex-column'>
                            <label htmlFor="ordinal" className='mb-1'>ครั้งที่</label>
                            <input
                                type="number"
                                id="ordinal"
                                value={ordinal2}
                                onChange={(e) => setOrdinal2(parseInt(e.target.value))}
                            />
                        </div>
                        <div className='d-flex flex-column'>
                            <label htmlFor="max_team" className='mb-1'>จำนวนทีม</label>
                            <input
                                type="number"
                                id="max_team"
                                value={max_team2}
                                onChange={(e) => setMax_team2(parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div>
                        <Button onClick={updateHoliday}>ยืนยัน</Button>
                    </div>
                    <div>
                        <Button className='btn-danger' onClick={() => setShow2(false)}>ยกเลิก</Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>

    )
}

export default holiday