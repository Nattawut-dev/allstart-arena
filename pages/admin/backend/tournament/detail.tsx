import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import styles from '@/styles/detailTornament.module.css';
import { Button, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { AiFillEdit } from "react-icons/ai";
import AdminLayout from '@/components/AdminLayout';
import Head from 'next/head';

interface Detail {
    id: number;
    listT_id: number
    team_name: string;
    Name_1: string;
    Nickname_1: string;
    age_1: number;
    gender_1: string;
    affiliation_1: string;
    tel_1: string;
    image_1: string;
    Name_2: string;
    Nickname_2: string;
    age_2: number;
    gender_2: string;
    affiliation_2: string;
    tel_2: string;
    image_2: string;
    level: string;
    status: number;
    price: number;
    slipurl: string;
    team_type: string;
    paymentStatus: number;
}
interface Listtournament {
    id: number;
    title: string;
    ordinal: number;
    location: string;
    timebetween: string;
    status: number;
    max_team: number;
    price: number;
}
export const getServerSideProps = async ({ req }: any) => {
    const sessiontoken = req.cookies.sessionToken;

    if (!sessiontoken) {
        return {
            redirect: {
                destination: '/admin/login',
                permanent: false,
            },
        };
    } else {
        return {
            props: {
            },
        };
    }
}
function Detail() {
    const router = useRouter();

    const [selectedStatus, setSelectedStatus] = useState(0);
    const [checkDisabled, setCheckDisabled] = useState(true);

    const [detail_data, setDetail_data] = useState<Detail[]>([]);
    const [team_detail, setTeam_detail] = useState<Detail>();

    const [listtournament, setListtournament] = useState<Listtournament[]>([]);
    const [List_T_ID, setList_T_ID] = useState(0);
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);

    const [editTeam_type, setEditTeam_type] = useState(false);
    const [selectEdit_team_type, setSelectEdit_team_type] = useState(0);
    const [newTeam_type, setNewTeam_type] = useState('');

    const [targetSlip, setTargetSlip] = useState<Detail>();


    const { level } = router.query;

    useEffect(() => {
        if (level != undefined && typeof level === 'string') {
            fetchTournamentdata();
        }
    }, [level])



    async function fetchTournamentdata() {
        try {
            const response1 = await fetch('/api/admin/tournament/listTournament/get');
            const listtournament = await response1.json();
            if (response1.ok) {
                setListtournament(listtournament);
                const listTourID = listtournament[0].id
                setList_T_ID(listTourID);
                fetchDetail(level, listTourID);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const ListournamentOptions = listtournament.map((item) => {
        return (
            <option
                key={item.id}
                value={`${item.id}`}
            >
                {item.title}
            </option>
        );
    });

    const fetchDetail = async (level: any, listT_id: number) => {
        try {
            const encodedLevel = encodeURIComponent(level);
            const response = await fetch(`/api/admin/tournament/detail/getByLevel?level=${encodedLevel}&listT_id=${listT_id}`);
            const data = await response.json();
            if (response.ok) {
                setDetail_data(data);

            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
            setDetail_data([]);
        }
    };

    const showDetail = async (id: number) => {
        try {
            const response = await fetch(`/api/admin/tournament/protest/getTeamDetail?id=${id}`);
            const tournament_data = await response.json();
            if (response.ok) {
                setTeam_detail(tournament_data[0]);
                setCheckDisabled(true);
                setShow(true);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const updateStatus = () => {
        const text = team_detail?.status === 0 ? "ยังไม่ตรวจสอบ" : team_detail?.status === 1 ? "ไม่ผ่าน" : "ผ่าน"
        const text2 = selectedStatus === 0 ? "ระหว่างพิจารณา" : selectedStatus === 1 ? "ไม่ผ่าน" : "ผ่าน"

        Swal.fire({
            title: `ต้องการบันทึกสถานะ ? `,
            text: `"${text}" เปลี่ยนเป็น "${text2}" `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'บันทึก'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`/api/admin/tournament/protest/updateStatus`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ id: team_detail?.id, newStatus: selectedStatus }),
                    });

                    if (!response.ok) {
                        Swal.fire(
                            'มีข้อผิดพลาด',
                            ``,
                            'error'
                        )

                        throw new Error('An error occurred while deleting the data.');

                    } else {
                        setShow(false);
                        Swal.fire(
                            'สำเร็จ!',
                            `เปลี่ยนสถานะเป็น "${text2}" เรียบร้อย`,
                            'success'
                        )
                    }

                    fetchDetail(level, List_T_ID);
                } catch (error: any) {
                    console.error(error.message);
                    // Handle any error or display an error message
                }

            }
        })
    }
    const updatePaymentStatus = (status: number) => {
        const text = targetSlip?.paymentStatus === 0 ? "ยังไม่ชำระ" : targetSlip?.paymentStatus === 1 ? "รอตรวจสอบ" : targetSlip?.paymentStatus === 2 ? "ชำระแล้ว" : "ปฎิเสธสลิป"
        const text2 = status === 0 ? "ยังไม่ชำระ" : status === 1 ? "รอตรวจสอบ" : status === 2 ? "ชำระแล้ว" : "ปฎิเสธสลิป"

        Swal.fire({
            title: `เปลี่ยนสถานะการชำระเงิน ? `,
            text: `ทีม ${targetSlip?.team_name}  จาก "${text}" เปลี่ยนเป็น "${text2}" `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'บันทึก'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`/api/admin/tournament/detail/payment/updateStatus`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ id: targetSlip?.id, newStatus: status }),
                    });

                    if (!response.ok) {
                        Swal.fire(
                            'มีข้อผิดพลาด',
                            ``,
                            'error'
                        )

                        throw new Error('An error occurred while deleting the data.');

                    } else {
                        setShow2(false);
                        Swal.fire(
                            'สำเร็จ!',
                            `เปลี่ยนสถานะเป็น "${text2}" เรียบร้อย`,
                            'success'
                        )
                    }

                    fetchDetail(level, List_T_ID);
                } catch (error: any) {
                    console.error(error.message);
                    // Handle any error or display an error message
                }

            }
        })
    }
    const max_team = () => {
        const max_team = listtournament.find((item) => item.id === List_T_ID)
        return max_team?.max_team;
    }
    const main_team = () => {
        const main_team = detail_data.filter((item) => item.team_type === "ทีมหลัก")
        return main_team.length;
    }
    const reserve_team = () => {
        const reserve_team = detail_data.filter((item) => item.team_type === "ทีมสำรอง")
        return reserve_team.length;
    }
    const deleteTeam = (item: Detail) => {
        Swal.fire({
            title: `ต้องการลบทีม? "${item.team_name}" `,
            text: `หากลบแล้วไม่สามารถย้อนกลับได้`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`/api/admin/tournament/detail/delete?id=${item.id}`, {
                        method: 'DELETE',
                    });

                    if (!response.ok) {
                        throw new Error('An error occurred while deleting the data.');
                    } else {
                        setShow(false);
                        Swal.fire(
                            'Deleted!',
                            `ลบทีม "${item.team_name}" เรียบร้อย`,
                            'success'
                        )
                    }

                    fetchDetail(level, List_T_ID);
                } catch (error: any) {
                    console.error(error.message);
                    // Handle any error or display an error message
                }

            }
        })
    }
    const checkSlip = (id: number) => {
        const target = detail_data.find((item) => item.id === id);
        if (target) {
            setTargetSlip(target);
            setShow2(true);
        }
    }
    const saveteam_type = (item: Detail) => {
        Swal.fire({
            title: `เปลี่ยนสถานะทีม`,
            text: `จาก "${item.team_type}" เป็น "${newTeam_type}"`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'บันทึก'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`/api/admin/tournament/detail/updateTeam_type`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ id: item.id, newStatus: newTeam_type }),
                    });

                    if (!response.ok) {
                        Swal.fire(
                            'มีข้อผิดพลาด',
                            ``,
                            'error'
                        )

                        throw new Error('An error occurred while deleting the data.');

                    } else {
                        setEditTeam_type(false)
                        Swal.fire(
                            'สำเร็จ!',
                            `เปลี่ยนสถานะเป็น "${newTeam_type}" เรียบร้อย`,
                            'success'
                        )
                    }

                    fetchDetail(level, List_T_ID);
                } catch (error: any) {
                    console.error(error.message);
                    // Handle any error or display an error message
                }

            }
        })
    }

    return (
        <AdminLayout>
            <Head>
                <title>Detail {`${level}`}</title>
            </Head>
            <div style={{ textAlign: 'center', margin: 'auto' }}>
                <div className='mb-1' style={{ justifyContent: 'center', textAlign: 'center', display: 'flex' }}>
                    <label htmlFor="status" className='text-nowrap mx-2 mt-1' >ผู้สมัครแข่ง :</label>
                    <select
                        className={`text-center form-select form-select-sm`}
                        style={{ maxWidth: 'fit-content' }}
                        id="status"
                        name="status"
                        onChange={(e) => {
                            const ID = parseInt(e.target.value);
                            setList_T_ID(ID);
                            fetchDetail(level, ID);
                        }}
                    >
                        {ListournamentOptions}

                    </select>
                </div>
                <div className='bg-primary text-white mb-1'>
                    <span className='text-nowrap mx-2 fs-6 my-2'> ระดับมือ {level} </span>
                    <span className='text-nowrap mx-2 fs-6 my-2'> ทีมหลัก {main_team()} / {max_team()}</span>
                    <span className='text-nowrap mx-2 fs-6 my-2'> ทีมสำรอง {reserve_team()} </span>
                </div>


                <div className={styles.container} >
                    <table className={`table table-sm  table-bordered table-striped ${styles.table}`}>
                        <thead className='table-info'>
                            <tr>
                                <th className={styles.onMobile}>#</th>
                                <th>ชื่อทีม</th>
                                <th className={styles.onMobile}>ชื่อนักกีฬา 1</th>
                                <th className={styles.onMobile}>ชื่อนักกีฬา 2</th>
                                <th>ผล</th>
                                <th>ชำระเงิน</th>
                                <th>รายละเอียด</th>
                                <th >หมายเหตุ </th>
                                <th>ลบ</th>

                            </tr>
                        </thead>
                        <tbody>

                            {detail_data.map((item, index) => (
                                <tr key={item.id}>
                                    <td className={styles.onMobile}>{index + 1}</td>
                                    <td>{item.team_name}</td>
                                    <td className={styles.onMobile}>{item.Name_1} ({item.Nickname_1})</td>
                                    <td className={styles.onMobile}>{item.Name_2}  ({item.Nickname_2})</td>

                                    {item.status === 0 && (
                                        <td className="table-warning">พิจารณา</td>
                                    )}
                                    {item.status === 2 && <td className="table-success">ผ่าน</td>}
                                    {item.status === 1 && <td className="table-danger">ไม่ผ่าน</td>}


                                    {item.paymentStatus === 0 && <td className="table-danger">ยังไม่ชำระ</td>}
                                    {item.paymentStatus === 1 && <td className="table-warning">รอตรวจสอบ</td>}
                                    {item.paymentStatus === 2 && <td className="table-success">ชำระแล้ว</td>}
                                    {item.paymentStatus === 3 && <td className="bg-danger text-white">ปฎิเสธสลิป</td>}

                                    <td>
                                        <Button variant="primary btn-sm me-1" onClick={() => showDetail(item.id)} className={styles.btn}>
                                            ข้อมูล
                                        </Button>

                                        <Button variant="warning btn-sm btn " disabled={item.paymentStatus === 0} onClick={() => checkSlip(item.id)} className={styles.btn}>
                                            สลิป
                                        </Button>
                                    </td>
                                    <td className='fw-bold' style={{ width: '0 ', margin: '0' }}>
                                        {editTeam_type && selectEdit_team_type === item.id ? (
                                            <div className='d-flex flex-row' >
                                                <select
                                                    className='form-select form-select-sm'
                                                    style={{ width: 'fit-content' }}
                                                    value={newTeam_type}
                                                    onChange={(e) => {
                                                        const newValue = e.target.value;
                                                        setNewTeam_type(newValue);
                                                    }}
                                                >
                                                    <option value="ทีมหลัก">ทีมหลัก</option>
                                                    <option value="ทีมสำรอง">ทีมสำรอง</option>
                                                </select>
                                                <Button className='btn-sm ms-1 ' disabled={newTeam_type === item.team_type} onClick={() => saveteam_type(item)}>Save</Button>
                                                <Button className='btn-sm btn-danger ms-1' onClick={() => setEditTeam_type(false)}>C</Button>

                                            </div>

                                        ) : (
                                            item.team_type === "ทีมหลัก" ? (
                                                <span className='text-success'>ทีมหลัก <Button className='btn-sm fs-6' style={{ padding: '0 5px' }} onClick={() => { setEditTeam_type(true); setSelectEdit_team_type(item.id); setNewTeam_type(item.team_type) }}><AiFillEdit style={{ fontSize: '10px' }} /></Button></span>
                                            ) : (
                                                <span className='text-warning'>ทีมสำรอง <Button className='btn-sm fs-6' style={{ padding: '0 5px' }} onClick={() => { setEditTeam_type(true); setSelectEdit_team_type(item.id); setNewTeam_type(item.team_type) }}><AiFillEdit style={{ fontSize: '10px' }} /></Button></span>
                                            )
                                        )}
                                    </td>
                                    <td>
                                        <Button
                                            className="btn-sm btn-danger"
                                            style={{ width: "100%" }}
                                            onClick={() => deleteTeam(item)}
                                        >
                                            ลบ
                                        </Button>
                                    </td>

                                </tr>
                            ))}
                            {detail_data.filter(item => item.level === level).length === 0 &&
                                <tr>
                                    <td colSpan={9} >ยังไม่มีผู้สมัคร</td>
                                </tr>
                            }

                        </tbody>
                    </table>
                </div >

                <Modal
                    show={show}
                    onHide={() => setShow(false)}
                    backdrop="static"
                    keyboard={false}
                    aria-hidden="true"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <div className={styles.titleM}>
                                <h5>รายละเอียดทีม <span style={{ fontWeight: 'bolder' }}> {team_detail?.team_name}  </span>ระดับมือ  {team_detail?.level}</h5>
                            </div>

                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <div className={styles.wrapper}>
                            <div className={styles.detail}>
                                <img src={team_detail?.image_1} alt="photo" width="200" height="250" />
                                <div> <span>ชื่อ {team_detail?.Name_1} ({team_detail?.Nickname_1})</span></div>
                                <div><span>อายุ {team_detail?.age_1} ปี  : เพศ {team_detail?.gender_1}</span></div>
                                <div> <span>สังกัด {team_detail?.affiliation_1}</span></div>
                                <div> <span>เบอร์: {team_detail?.tel_1}</span></div>

                            </div>
                            <div className={styles.detail}>
                                <img src={team_detail?.image_2} alt="photo" width="200" height="250" />
                                <div><span>ชื่อ {team_detail?.Name_2} ({team_detail?.Nickname_2})</span></div>
                                <div><span>อายุ {team_detail?.age_2} ปี  : เพศ {team_detail?.gender_2}</span></div>
                                <div><span>สังกัด {team_detail?.affiliation_2}</span></div>
                                <div> <span>เบอร์: {team_detail?.tel_2}</span></div>

                            </div>
                        </div>

                    </Modal.Body>
                    <Modal.Footer className={styles.wrapper2}>
                        <div className={styles.wrapper2}>

                            <div >
                                <h5 className={styles.wrapper3} >
                                    <label htmlFor="status" className='text-nowrap mx-2 p-1'>เลือกสถานะ : </label>
                                    <select
                                        className={`text-center form-select text-dark ${selectedStatus === 0 ? 'bg-warning' : selectedStatus === 1 ? 'bg-danger text-white' : 'bg-info'} `}
                                        id="status"
                                        name="status"
                                        value={selectedStatus}
                                        onChange={(e) => {
                                            const selectedStatus = e.target.value;
                                            setCheckDisabled(parseInt(selectedStatus) === team_detail?.status)
                                            setSelectedStatus(parseInt(selectedStatus));

                                        }}
                                    >
                                        <option className='bg-white text-dark' value={0}>ระหว่างพิจารณา</option>
                                        <option className='bg-white text-dark' value={1}>ไม่ผ่าน</option>
                                        <option className='bg-white text-dark' value={2}>ผ่าน</option>

                                    </select></h5>

                            </div>
                            <Button variant="primary" disabled={checkDisabled} onClick={() => updateStatus()}>บันทึกสถานะ</Button>
                        </div>

                    </Modal.Footer>
                </Modal>

                <Modal
                    show={show2}
                    onHide={() => setShow2(false)}
                    backdrop="static"
                    keyboard={false}
                    aria-hidden="true"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <div className={styles.titleM}>
                                <h5>หลักฐานการโอนเงินทีม <span style={{ fontWeight: 'bolder' }}> {targetSlip?.team_name}  </span></h5>
                            </div>

                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='d-flex justify-content-center'>
                            {targetSlip?.slipurl ? <img src={targetSlip?.slipurl} alt="slip" width={364} height={512} style={{ borderRadius: "13px" }} /> :
                                <h5>Not found Slip</h5>
                            }
                        </div>
                        <h5 className='d-flex justify-content-center my-2'>ยอดชำระ {targetSlip?.price} บาท </h5>
                        <h5 className='d-flex justify-content-center my-2'>สถานะ :
                            <span className='text-white'>
                                {targetSlip?.paymentStatus === 0 && <span className="bg-danger bg-gradient p-1 mx-2 rounded"> ยังไม่ชำระ</span>}
                                {targetSlip?.paymentStatus === 1 && <span className="bg-warning mx-2 p-1 rounded"> รอตรวจสอบ</span>}
                                {targetSlip?.paymentStatus === 2 && <span className="bg-primary  mx-2  p-1 rounded"> ชำระแล้ว</span>}
                                {targetSlip?.paymentStatus === 3 && <span className="bg-danger bg-gradient p-1 mx-2 rounded"> ปฎิเสธสลิป</span>}

                            </span>
                        </h5>
                        <div className={`${styles.footer1} d-flex justify-content-center my-2`}>
                        </div>
                    </Modal.Body>
                    <Modal.Footer >
                        <div className={styles.footer1}>
                            <div className={styles.btn1}>
                                <Button className='btn-primary ' disabled={targetSlip?.paymentStatus === 2} onClick={() => updatePaymentStatus(2)}>อนุมัติ</Button>
                                <Button variant="danger mx-2" disabled={targetSlip?.paymentStatus === 3} onClick={() => updatePaymentStatus(3)}>ปฎิเสธ</Button>
                            </div>

                            <div className={styles.slipbtn}>
                                <Button variant="secondary" onClick={() => setShow2(false)}>Close</Button>
                            </div>

                        </div>


                    </Modal.Footer>
                </Modal>
            </div>

        </AdminLayout>
    )
}

export default Detail