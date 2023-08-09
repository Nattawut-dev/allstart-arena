import { differenceInCalendarDays, format } from 'date-fns';
import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from '@/styles/admin/tournament/setting.module.css'
import Swal from 'sweetalert2'


interface Tournament {
    id: number;
    title: string;
    ordinal: number;
    location: string;
    timebetween: string;
    status: number;
}





function holiday() {
    const [tournament, setTournament] = useState<Tournament[]>([])
    const [editholiday, setEditholiday] = useState<Tournament | null>(null);

    const [isTournament, setIsTournament] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const [title, setTitle] = useState('');
    const [timebetween, setTimebetween] = useState('');
    const [location, setLocation] = useState('');
    const [ordinal, setOrdinal] = useState(0);

    const [id2, setID2] = useState(0);
    const [title2, setTitle2] = useState('');
    const [timebetween2, setTimebetween2] = useState('');
    const [location2, setLocation2] = useState('');
    const [ordinal2, setOrdinal2] = useState(0);
    const [status, setStatus] = useState(false);

    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);


    useEffect(() => {
        getHoliday();
    }, []);


    const getHoliday = async () => {
        try {
            const response = await fetch(`/api/admin/tournament/get`);
            const data = await response.json();
            if (data.length >= 1) {
                setTournament(data);
                setIsTournament(true)
            } else {
                setIsTournament(false)
            }
        } catch {
            console.log('error');
        }
    };
    const [loading, setLoading] = useState(false);


    const handleCheckboxChange = async (id: number, currentStatus: number) => {
        const newStatus = currentStatus === 1 ? 0 : 1;
        const checkIf1 = tournament.find(tournament => tournament.status === 1);
        if (checkIf1 && newStatus != 0) {
            Swal.fire({
                icon: 'error',
                title: 'ข้อผิดพลาด',
                text: 'สามารถเปิดได้แค่ครั้งละ 1 การแข่งเท่านั้น',
            })
            return;
        }
        try {
            const response = await fetch('/api/admin/tournament/statusUpdate', {
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
            setTournament((prevTournament) =>
                prevTournament.map((tournament) =>
                    tournament.id === id ? { ...tournament, status: newStatus } : tournament
                )
            );
        } catch (error: any) {
            console.error(error.message);
            // Handle any error or display an error message
        }
    };
    const deleteTournament = async (id: number, title: string, location: string, ordinal: number) => {
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
                    const response = await fetch(`/api/admin/tournament/delete?id=${id}`, {
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
                    setTournament((prevTournament) =>
                        prevTournament.filter((Tournament) => Tournament.id !== id)
                    );
                } catch (error: any) {
                    console.error(error.message);
                    // Handle any error or display an error message
                }

            }
        })

    };

    const handleAddTournament = async () => {
        if (title == '') {
            Swal.fire({
                icon: 'error',
                title: 'กรอกหัวข้อ',
                text: 'กรุณากรอกหัวข้อ',
            })
            return;
        }

        try {

            const response = await fetch('/api/admin/tournament/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, ordinal, location, timebetween }),
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

            setShow(false);
            getHoliday();

        } catch (error) {
            console.error('An error occurred while adding the data:', error);
            // Handle any error or display an error message
        }
    };
    const editSelecter = (item: Tournament) => {
        setTitle2(item.title);
        setID2(item.id);
        setLocation2(item.location);
        setOrdinal2(item.ordinal);
        setTimebetween2(item.timebetween);
        setShow2(true);
    }

    async function updateHoliday() {
        try {
            const response = await fetch(`/api/admin/tournament/update`, {
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
            getHoliday();

        } catch (error) {
            console.error('An error occurred while updating the data:', error);
            throw error;
        }
    }

    if (!isTournament) {
        return (
            <div>No Tournament</div>
        )
    }

    return (
        <>

            <div className={styles.container}>

                <div className={styles.box}>
                    <h5 className='fw-bold'>จัดการ รายการแข่งขัน</h5>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">ชื่อ</th>
                                <th scope="col">สถานที่</th>
                                <th scope="col">วันจัด-วันสิ้นสุด</th>
                                <th scope="col">ครั้งที่</th>
                                <th scope="col">สถานะ</th>
                                <th scope="col">อัพเดท</th>
                                <th scope="col">ลบ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tournament.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.title}</td>
                                    <td>{item.location}</td>
                                    <td>{item.timebetween}</td>
                                    <td>{item.ordinal}</td>

                                    <td>
                                        <div className={styles.switch}>
                                            <input
                                                type="checkbox"
                                                id={`${item.id}`}
                                                checked={item.status === 1}
                                                onChange={() => handleCheckboxChange(item.id, item.status)}
                                            />
                                            <label htmlFor={`${item.id}`}>Toggle</label>
                                        </div>
                                    </td>
                                    <td>
                                        <Button
                                            className="btn-sm"
                                            onClick={() => {
                                                editSelecter(item)
                                            }}
                                        >
                                            แก้ไข
                                        </Button>
                                    </td>
                                    <td>
                                        <Button
                                            className="btn-sm btn-danger"
                                            onClick={() => deleteTournament(item.id, item.title, item.location, item.ordinal)}
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
                    <div className={styles.addtournament}>
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
                                value={timebetween2}
                                onChange={(e) => setTimebetween2(e.target.value)}
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
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div>
                        <Button onClick={handleAddTournament}>ยืนยัน</Button>
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
                    <div className={styles.addtournament}>
                        <div className='d-flex flex-column'>
                            <label htmlFor="title" className='mb-2'>ชื่อ</label>
                            <input
                                type="text"
                                id='title'
                                placeholder='ชื่องานแข่ง'
                                value={title2}
                                onChange={(e) => setTitle2(e.target.value)}
                            />
                        </div>
                        <div className='d-flex flex-column'>
                            <label htmlFor="location" className='mb-2'>สถานที่</label>
                            <input
                                type="text"
                                id='location'
                                placeholder='สถานที่'
                                value={location2}
                                onChange={(e) => setLocation2(e.target.value)}
                            />
                        </div>
                        <div className='d-flex flex-column'>
                            <label htmlFor="timebetween" className='mb-2'>วันจัด-วันสิ้นสุด</label>
                            <input
                                type="text"
                                id='timebetween'
                                placeholder='วันที่เริ่ม-วันที่สิ้นสุด'
                                value={timebetween2}
                                onChange={(e) => setTimebetween2(e.target.value)}
                            />
                        </div>
                        <div className='d-flex flex-column'>
                            <label htmlFor="ordinal" className='mb-2'>ครั้งที่</label>
                            <input
                                type="number"
                                id="ordinal"
                                value={ordinal2}
                                onChange={(e) => setOrdinal2(parseInt(e.target.value))}
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