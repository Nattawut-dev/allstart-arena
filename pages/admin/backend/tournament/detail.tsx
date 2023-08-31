import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import styles from '@/styles/detailTornament.module.css';
import { Button, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';

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
    price : number;
    slipurl:string;
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

function detail() {
    const router = useRouter();

    const [message, setMessage] = useState('');
    const [isTournament, setIsTournament] = useState(false);
    const [loading, setIsloading] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(0);
    const [checkDisabled, setCheckDisabled] = useState(true);

    const [detail_data, setDetail_data] = useState<Detail[]>([]);
    const [team_detail, setTeam_detail] = useState<Detail>();

    const [listtournament, setListtournament] = useState<Listtournament[]>([]);
    const [List_T_ID, setList_T_ID] = useState(0);
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [targetSlip, setTargetSlip] = useState<Detail>();


    const { level } = router.query;

    const checkAuthentication = async () => {
        try {
            const response = await fetch('/api/admin/check-auth', {
                method: 'GET',
                credentials: 'include', // Include cookies in the request
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
            } else {
                // Redirect to the login page if the user is not authenticated
                router.push('/admin/login');
                return;
            }

        } catch (error) {
            console.error('Error while checking authentication', error);
            setMessage('An error occurred. Please try again later.');
        }
    };
    useEffect(() => {
        checkAuthentication();
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
                setIsTournament(true);

            }
            else {
                setIsTournament(false);

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
                setSelectedStatus(tournament_data[0].paymentStatus);
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

    if (!isTournament || message != "Authenticated" || level == undefined || loading) {
        return (
            <>
                <div style={{ top: "50%", left: "50%", position: "absolute", transform: "translate(-50%,-50%)" }}>
                    <h5 >loading....</h5>
                </div>
            </>
        );
    }
    return (
        <>
            <div className={styles.header}>
                {/* {listtournament.length >= 1 && (
                    <div>
                        <h6>รายการแข่งแบดมินตัน <span>{listtournament[0].title}</span> ครั้งที่ <span> {listtournament[0].ordinal}</span></h6>
                        <h6>ณ สถานที่ <span> {listtournament[0].location}</span></h6>
                        <h6>ระหว่างวันที่ <span>{listtournament[0].timebetween}</span></h6>
                        <h6>ระดับมือ <span style={{ fontWeight: 'bolder' }}>{level}</span> </h6>
                    </div>
                )
                } */}
                <h4 className='d-flex flex-row ' style={{ width: 'fit-content' }}>
                    <label htmlFor="status" className='text-nowrap mx-2 '>ผู้สมัครแข่ง  <span> ระดับมือ {level}</span> :</label>
                    <select
                        className={`text-center form-select `}
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
                    <span className='text-nowrap mx-5 fs-6 my-2'> ทีมหลัก {main_team()} / {max_team()}</span>
                    <span className='text-nowrap mx-2 fs-6 my-2'> ทีมสำรอง {reserve_team()} </span>

                </h4>

            </div>
            <div className={styles.container}>
                <table className={`table table-bordered table-striped  ${styles.table}`}>
                    <thead className='table-info'>
                        <tr>
                            <th>#</th>
                            <th>ชื่อทีม</th>
                            <th>ชื่อนักกีฬา 1</th>
                            <th>ชื่อนักกีฬา 2</th>
                            <th>ผลการพิจารณา</th>
                            <th>สถานะการชำระ</th>
                            <th>รายละเอียด/การโอน</th>
                            <th>หมายเหตุ</th>
                            <th>ลบ</th>

                        </tr>
                    </thead>
                    <tbody>

                        {detail_data.map((item, index) => (
                            <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>{item.team_name}</td>
                                <td>{item.Name_1} ({item.Nickname_1})</td>
                                <td>{item.Name_2}  ({item.Nickname_2})</td>

                                {item.status === 0 && (
                                    <td className="table-warning">ระหว่างพิจารณา</td>
                                )}
                                {item.status === 2 && <td className="table-success">ผ่าน</td>}
                                {item.status === 1 && <td className="table-danger">ไม่ผ่าน</td>}


                                {item.paymentStatus === 0 && <td className="table-danger">ยังไม่ชำระ</td>}
                                {item.paymentStatus === 1 && <td className="table-warning">รอตรวจสอบ</td>}
                                {item.paymentStatus === 2 && <td className="table-success">ชำระแล้ว</td>}
                                <td>
                                    <Button variant="primary btn-sm" onClick={() => showDetail(item.id)} className={styles.btn}>
                                        รายละเอียด
                                    </Button>

                                    <Button variant="primary btn-sm btn  ms-2" onClick={() => checkSlip(item.id)} className={styles.btn}>
                                        สลิป
                                    </Button>
                                </td>
                                <td className='fw-bold'>{item.team_type === "ทีมหลัก" ? <span className='text-success'>ทีมหลัก</span> : <span className='text-warning'>ทีมสำรอง</span>}</td>
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
                        {targetSlip?.slipurl ? <img src={targetSlip?.slipurl} alt="slip" width={364} height={512} style={{borderRadius : "13px"}}/> :
                            <h5>Not found Slip</h5>
                        }
                    </div>
                    <h5 className='d-flex justify-content-center my-2'>ยอดชำระ {targetSlip?.price} บาท </h5>
                    <div className={`${styles.footer1} d-flex justify-content-center my-2`}>
                        <div >
                            <h5 className='d-flex flex-row' >
                                <label htmlFor="status" className='text-nowrap mx-2 p-1'>เลือกสถานะ : </label>
                                <select
                                    className={`text-center form-select text-dark ${selectedStatus === 0 ? 'bg-warning' :  'bg-info'} `}
                                    id="status"
                                    name="status"
                                    value={selectedStatus}
                                    onChange={(e) => {
                                        const selectedStatus = e.target.value;
                                        setCheckDisabled(parseInt(selectedStatus) === targetSlip?.paymentStatus)
                                        setSelectedStatus(parseInt(selectedStatus));
                                    }}
                                >
                                    <option className='bg-white text-dark' value={0}>ยังไม่ตรวจสอบ</option>
                                    <option className='bg-white text-dark' value={1}>ตรวจสอบแล้ว</option>

                                </select></h5>

                        </div>

                    </div>
                </Modal.Body>
                <Modal.Footer >

                    <Button variant="primary" disabled={checkDisabled} onClick={() => updateStatus()}>บันทึกสถานะ</Button>

                    <Button variant="secondary"  onClick={() => setShow2(false)}>Close</Button>

                </Modal.Footer>
            </Modal>

        </>
    )
}

export default detail