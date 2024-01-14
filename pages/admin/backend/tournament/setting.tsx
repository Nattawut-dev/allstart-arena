import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import styles from '@/styles/admin/tournament/setting.module.css'
import Swal from 'sweetalert2'
import Head from 'next/head';

interface Tournament {
    id: number;
    title: string;
    ordinal: number;
    location: string;
    timebetween: string;
    status: number;
}
interface Hand_level {
    id: number;
    name: string;
    max_team_number: number;
    price: number;
}
interface MaxTeamValues {
    [key: number]: {
        value: number;
        price: number;
    };
}
function Holiday() {
    const [tournament, setTournament] = useState<Tournament[]>([])
    const [isTournament, setIsTournament] = useState(false);
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
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [maxTeamValues, setMaxTeamValues] = useState<MaxTeamValues>({});

    const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
    const [hand_levels, setHand_levels] = useState<Hand_level[]>([])

    useEffect(() => {
        getHoliday();
        getAll_hand_level();
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
    const getAll_hand_level = async () => {
        try {
            const response = await fetch(`/api/tournament/select/get_all`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error('An error occurred while fetching the data.');
            }
            setHand_levels(data)


        } catch {
            console.log('error');
        }
    }
    const handleCheckboxChange = async (id: number, currentStatus: number) => {
        const newStatus = currentStatus === 1 ? 0 : 1;

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

                    setTournament((prevTournament) =>
                        prevTournament.filter((Tournament) => Tournament.id !== id)
                    );
                } catch (error: any) {
                    console.error(error.message);
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
                body: JSON.stringify({ title, ordinal, location, timebetween, max_team, maxTeamValues }),
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
    const editSelecter = (item: Tournament) => {
        setTitle2(item.title);
        setID2(item.id);
        setLocation2(item.location);
        setOrdinal2(item.ordinal);
        setTimebetween2(item.timebetween);
        setShow2(true);
    }

    async function updateTournament() {
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
                    timebetween: timebetween2,
                    max_team: max_team2,
                    hand_levels: maxTeamValues,
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
            getHoliday();

        } catch (error) {
            console.error('An error occurred while updating the data:', error);
            throw error;
        }
    }
    const fetchHand_level = async (tournament_id: number) => {
        try {
            const response = await fetch(`/api/tournament/select/hand_level?tournament_id=${tournament_id}`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error('An error occurred while fetching the data.');
            }
            setSelectedOptions([])
            setMaxTeamValues({})
            data.map((data1: Hand_level) => {
                setSelectedOptions(prevSelected => [...prevSelected, data1.id]);
                setMaxTeamValues(prevState => ({
                    ...prevState,
                    [data1.id]: {
                        value: data1.max_team_number,
                        price: data1.price
                    }
                }));
            })

        } catch {
            console.log('error');
        }
    }
    const handleCheckboxChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (e.target.checked) {
            setSelectedOptions(prevSelected => [...prevSelected, value]);
        } else {
            setSelectedOptions(prevSelected => prevSelected.filter(item => item !== value));
        }
    };
    const returnNameHandLevel = (id: number) => {
        const handlevel = hand_levels.find((h) => h.id == id)
        return handlevel?.name
    }
    return (
        <>
            <Head>
                <title>Setting tournament</title>
            </Head>
            <div className={styles.container}>
            <h5 className='fw-bold d-flex justify-content-center'>จัดการ รายการแข่งขัน</h5>
                <div className={styles.box}>
                    <table className="table table-bordered" >
                        <thead className='table-primary'>
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
                                                editSelecter(item);
                                                fetchHand_level(item.id)
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


                </div>
                <div className='d-flex justify-content-end my-1'> <Button onClick={() => setShow(true)}>เพิ่มงานแข่ง</Button></div>

            </div>

            <Modal show={show} onHide={() => { setShow(false); setSelectedOptions([]); setMaxTeamValues({}) }} centered keyboard={false} size='lg'>
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

                    </div>
                    <span className='d-flex justify-content-center fw-bold my-2 text-danger'>จัดระดับมือ</span>
                    <div className={`${styles.hand_level} d-flex flex-row`}>
                        {hand_levels.map((hand, index) => (
                            <div className={styles.checkbox_wrapper_33} key={index}>
                                <label className={styles.checkbox}>
                                    <input
                                        className={`${styles.checkbox__trigger} ${styles.visuallyhidden}`}
                                        type="checkbox"
                                        key={index}
                                        id={hand.name}
                                        value={hand.id}
                                        checked={selectedOptions.includes(hand.id)}
                                        onChange={handleCheckboxChange1} />

                                    <span className={styles.checkbox__symbol}>
                                        <svg aria-hidden="true" className={styles.icon_checkbox} width="28px" height="28px" viewBox="0 0 28 28" version="1" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4 14l8 7L24 7"></path>
                                        </svg>
                                    </span>
                                    <p className={styles.checkbox__textwrapper}>{hand.name}</p>
                                </label>
                            </div>
                        ))}
                    </div>
                    {selectedOptions.length > 0 && (
                        <>
                            <span className='d-flex justify-content-center fw-bold my-2 text-danger'>จำนวนทีมหลัก **โปรดกรอกทุกช่อง</span>
                            <div className={`${styles.hand_level} d-flex flex-row`}>
                                {selectedOptions.map((id, index) => (
                                    <div className='d-flex flex-row align-items-center justify-content-end' key={index} style={{ width: '220px' }}>
                                        <label htmlFor={`max_team_${id}`} className='mb-1'>
                                            {returnNameHandLevel(id)} =
                                        </label>
                                        <input
                                           key={index} 
                                            type="number"
                                            style={{ width: '80px', padding: '2px', margin: '5px' }}
                                            id={`max_team_${id}`}
                                            value={maxTeamValues[id]?.value || ''}
                                            onChange={(e) => {
                                                const newValue = parseInt(e.target.value);
                                                setMaxTeamValues(prevState => ({
                                                    ...prevState,
                                                    [id]: {
                                                        value: newValue,
                                                        price: maxTeamValues[id]?.price
                                                    }
                                                }));
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                            <span className='d-flex justify-content-center fw-bold my-2 text-danger'>ค่าสมัครแข่ง **โปรดกรอกทุกช่อง</span>
                            <div className={`${styles.hand_level} d-flex flex-row`}>
                                {selectedOptions.map((id, index) => (
                                    <div className='d-flex flex-row align-items-center justify-content-end' key={index} style={{ width: '220px' }}>
                                        <label htmlFor={`max_team_${id}`} className='mb-1'>
                                            {returnNameHandLevel(id)} =
                                        </label>
                                        <input
                                          key={index} 
                                            type="number"
                                            style={{ width: '80px', padding: '2px', margin: '5px' }}
                                            id={`max_team_${id}`}
                                            value={maxTeamValues[id]?.price || ''}
                                            onChange={(e) => {
                                                const newValue = parseInt(e.target.value);
                                                setMaxTeamValues(prevState => ({
                                                    ...prevState,
                                                    [id]: {
                                                        value: maxTeamValues[id]?.value,
                                                        price: newValue
                                                    }
                                                }));
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
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

            <Modal show={show2} onHide={() => { setShow2(false); setSelectedOptions([]); setMaxTeamValues({}) }} centered keyboard={false} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>แก้ไขงานแข่ง</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={styles.addtournament}>
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

                    </div>
                    <span className='d-flex justify-content-center fw-bold my-2 text-danger'>จัดระดับมือ</span>
                    <div className={`${styles.hand_level} d-flex flex-row`}>
                        {hand_levels.map((hand, index) => (
                            <div className={styles.checkbox_wrapper_33} key={index}>
                                <label className={styles.checkbox}>
                                    <input
                                        className={`${styles.checkbox__trigger} ${styles.visuallyhidden}`}
                                        type="checkbox"
                                        key={index}
                                        id={hand.name}
                                        value={hand.id}
                                        checked={selectedOptions.includes(hand.id)}
                                        onChange={handleCheckboxChange1} />

                                    <span className={styles.checkbox__symbol}>
                                        <svg aria-hidden="true" className={styles.icon_checkbox} width="28px" height="28px" viewBox="0 0 28 28" version="1" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4 14l8 7L24 7"></path>
                                        </svg>
                                    </span>
                                    <p className={styles.checkbox__textwrapper}>{hand.name}</p>
                                </label>
                            </div>
                        ))}
                    </div>
                    {selectedOptions.length > 0 && (
                        <>
                            <span className='d-flex justify-content-center fw-bold my-2 text-danger'>จำนวนทีมหลัก **โปรดกรอกทุกช่อง</span>
                            <div className={`${styles.hand_level} d-flex flex-row`}>
                                {selectedOptions.map((id, index) => (
                                    <div className='d-flex flex-row align-items-center justify-content-end' key={index} style={{ width: '220px' }}>
                                        <label htmlFor={`max_team_${id}`} className='mb-1'>
                                            {returnNameHandLevel(id)} =
                                        </label>
                                        <input
                                            type="number"
                                            style={{ width: '80px', padding: '2px', margin: '5px' }}
                                            id={`max_team_${id}`}
                                            value={maxTeamValues[id]?.value || ''}
                                            onChange={(e) => {
                                                const newValue = parseInt(e.target.value);
                                                setMaxTeamValues(prevState => ({
                                                    ...prevState,
                                                    [id]: {
                                                        value: newValue,
                                                        price: maxTeamValues[id]?.price
                                                    }
                                                }));
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                            <span className='d-flex justify-content-center fw-bold my-2 text-danger'>ค่าสมัครแข่ง **โปรดกรอกทุกช่อง</span>
                            <div className={`${styles.hand_level} d-flex flex-row`}>
                                {selectedOptions.map((id, index) => (
                                    <div className='d-flex flex-row align-items-center justify-content-end' key={index} style={{ width: '220px' }}>
                                        <label htmlFor={`max_team_${id}`} className='mb-1'>
                                            {returnNameHandLevel(id)} =
                                        </label>
                                        <input
                                            type="number"
                                            style={{ width: '80px', padding: '2px', margin: '5px' }}
                                            id={`max_team_${id}`}
                                            value={maxTeamValues[id]?.price || ''}
                                            onChange={(e) => {
                                                const newValue = parseInt(e.target.value);
                                                setMaxTeamValues(prevState => ({
                                                    ...prevState,
                                                    [id]: {
                                                        value: maxTeamValues[id]?.value,
                                                        price: newValue
                                                    }
                                                }));
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                </Modal.Body>
                <Modal.Footer>
                    <div>
                        <Button onClick={updateTournament}>ยืนยัน</Button>
                    </div>
                    <div>
                        <Button className='btn-danger' onClick={() => setShow2(false)}>ยกเลิก</Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>

    )
}

export default Holiday