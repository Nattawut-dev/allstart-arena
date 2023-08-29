import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import styles from '@/styles/detailTornament.module.css';
import { Button } from 'react-bootstrap';

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
}
function detail() {
    const router = useRouter();

    const [message, setMessage] = useState('');
    const [isTournament, setIsTournament] = useState(false);
    const [loading, setIsloading] = useState(false);

    const [detail_data, setDetail_data] = useState<Detail[]>([]);
    const [listtournament, setListtournament] = useState<Listtournament[]>([]);
    const [List_T_ID, setList_T_ID] = useState(0);

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

                </h4>
            </div>
            <div className={styles.container}>
                <table className={`table table-bordered table-striped  ${styles.table}`}>
                    <thead className='table-info'>
                        <tr>
                            <th>#</th>
                            <th>ชื่อทีม</th>
                            <th>ชื่อนักกีฬา 1</th>

                            {/* <th>ภาพชื่อนักกีฬา 1</th> */}
                            <th>ชื่อนักกีฬา 2</th>

                            {/* <th>ภาพชื่อนักกีฬา 2</th> */}
                            <th>ผลการพิจารณา</th>

                            <th>สถานะการชำระ</th>
                            <th>รายละเอียด</th>

                            <th>ประท้วง</th>

                            <th>หมายเหตุ</th>

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
                                    <Button variant="primary btn-sm" onClick={() => details(item.id)} className={styles.btn}>
                                        รายละเอียด
                                    </Button>
                                </td>
                                <td><Button variant="danger btn-sm" onClick={() => note(item.id, item.listT_id)} className={styles.btn}>
                                    ประท้วง
                                </Button></td>
                                <td className='fw-bold'>{listtournament[0].max_team > index ? <span className='text-success'>ทีมหลัก</span> : <span className='text-warning'>ทีมสำรอง</span>}</td>

                            </tr>
                        ))}
                        {detail_data.filter(item => item.level === level).length === 0 &&
                            <tr>
                                <td colSpan={9} >ยังไม่มีผู้สมัคร</td>
                            </tr>
                        }

                    </tbody>
                </table>
            </div>
        </>
    )
}

export default detail