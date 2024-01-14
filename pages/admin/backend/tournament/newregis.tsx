import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import styles from '@/styles/detailTornament.module.css';
import { Button, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { AiFillEdit } from "react-icons/ai";
import Head from 'next/head';
import Image from 'next/image';

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
    hand_level_id: number;
    status: number;
    price: number;
    slipurl: string;
    team_type: string;
    paymentStatus: number;
    hand_level_name: string;
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
interface Handlevel {
    id: number;
    name: string;
    max_team_number: number;
    price: number;
}
function Detail() {
    const router = useRouter();
    const [gender_1, setGender_1] = useState('');
    const [gender_2, setGender_2] = useState('');

    const [Hand_Level, setHand_Level] = useState<{ id: number; name: string; }[]>([]);
    const [handlevel, setHandlevel] = useState<Handlevel[]>([]);

    const [status1, setStatus1] = useState(''); // สถานะ
    const [paymentStatus1, setPaymentStatus1] = useState(''); // สถานะการชำระเงิน
    const [hand_level1, setHand_level1] = useState(''); // สถานะ

    const [selectedStatus, setSelectedStatus] = useState(0);
    const [checkDisabled, setCheckDisabled] = useState(true);

    const [detail_data, setDetail_data] = useState<Detail[]>([]);
    const [team_detail, setTeam_detail] = useState<Detail>();
    const [team_detail_check, setTeam_detail_check] = useState<Detail>();


    const [listtournament, setListtournament] = useState<Listtournament[]>([]);
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);

    const [editTeam_type, setEditTeam_type] = useState(false);
    const [selectEdit_team_type, setSelectEdit_team_type] = useState(0);
    const [newTeam_type, setNewTeam_type] = useState('');

    const [targetSlip, setTargetSlip] = useState<Detail>();


    const { status, paymentStatus, listT_id, hand_level } = router.query;
    async function fetchTournamentdata() {
        try {
            const response1 = await fetch('/api/admin/tournament/listTournament/get');
            const listtournament = await response1.json();
            if (response1.ok) {
                setListtournament(listtournament);
                let listTourID = listtournament[0].id
                if (listT_id !== undefined) {
                    listTourID = listT_id
                } else {
                    router.query.listT_id = listTourID
                    router.push(router)
                }
                // if (hand_level !== undefined) {
                //     hand_Level = hand_level
                // } else {
                //     router.query.hand_level = hand_Level[0].name
                //     router.push(router)
                // }
                // setList_T_ID(listTourID);
                getList_hand_level(listTourID);
                fetchDetail(status, paymentStatus, listTourID, hand_level);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    useEffect(() => {
        setStatus1(status as string);
        fetchHand_level()
        setPaymentStatus1(paymentStatus as string);
        if (status !== undefined && typeof status === 'string') {
            fetchTournamentdata();
        }
    }, [status, paymentStatus, hand_level])



    const getList_hand_level = async (id: number) => {
        const res = await fetch(`/api/tournament/select/hand_level?tournament_id=${id}`, {
            method: "GET",
        })
        const handLevel = await res.json()
        setHandlevel(handLevel);
    };
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

    const fetchDetail = async (status: any, payment_Status: any, listT_id: any, hand_level: any) => {
        let url = `/api/admin/tournament/detail/getByStatus?`
        if (status != undefined) {
            url += `status=${status}&`;
        }
        if (payment_Status != undefined) {
            url += `paymentStatus=${payment_Status}&`
        }
        if (listT_id != undefined) {
            url += `listT_id=${listT_id}&`
        }
        if (hand_level != undefined) {
            url += `hand_level=${hand_level}&`
        }

        // url += listT_id !== undefined ? `listT_id=${listT_id}&` : `listT_id=${}&`
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (response.ok) {
                setDetail_data(data);
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
            setDetail_data([]);
        }
    };
    const fetchHand_level = async () => {
        try {
            const response = await fetch('/api/admin/setting/hand_level');

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            setHand_Level(data);
        } catch (error) {
            // แสดง SweetAlert2 ในกรณีเกิดข้อผิดพลาด
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch data. Please try again later.',
            });
            console.error('Error fetching data:', error);
        }
    };

    const showDetail = async (id: number) => {
        try {
            const response = await fetch(`/api/admin/tournament/protest/getTeamDetail?id=${id}`);
            const tournament_data = await response.json();
            if (response.ok) {
                setTeam_detail(tournament_data[0]);
                setTeam_detail_check(tournament_data[0]);
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
        const team_type = selectedStatus === 0 ? "รอตรวจสอบ" : selectedStatus === 1 ? "ไม่ผ่าน" : "ทีมหลัก"
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
                        body: JSON.stringify({ id: team_detail?.id, newStatus: selectedStatus, team_type: team_type }),
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

                    fetchDetail(status, paymentStatus, listT_id, hand_level);
                } catch (error: any) {
                    console.error(error.message);
                    // Handle any error or display an error message
                }

            }
        })
    }
    const updatePaymentStatus = (newStatus: number) => {
        const text = targetSlip?.paymentStatus === 0 ? "ยังไม่ชำระ" : targetSlip?.paymentStatus === 1 ? "รอตรวจสอบ" : targetSlip?.paymentStatus === 2 ? "ชำระแล้ว" : "ปฎิเสธสลิป"
        const text2 = newStatus === 0 ? "ยังไม่ชำระ" : newStatus === 1 ? "รอตรวจสอบ" : newStatus === 2 ? "ชำระแล้ว" : "ปฎิเสธสลิป"

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
                        body: JSON.stringify({ id: targetSlip?.id, newStatus: newStatus }),
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

                    fetchDetail(status, paymentStatus, listT_id, hand_level);
                } catch (error: any) {
                    console.error(error.message);
                    // Handle any error or display an error message
                }

            }
        })
    }
    // const max_team = () => {
    //     const max_team = listtournament.find((item) => item.id === parseInt(listT_id as string))
    //     return max_team?.max_team;
    // }
    const main_team = () => {
        const main_team = detail_data.filter((item) => item.team_type === "ทีมหลัก")
        return main_team.length;
    }
    const reserve_team = () => {
        const reserve_team = detail_data.filter((item) => item.team_type === "ทีมสำรอง")
        return reserve_team.length;
    }
    const maxteam = () => {
        const maxteam = handlevel.find((hand) => hand.id.toString() == hand_level)
        if (maxteam) {
            return maxteam.max_team_number;
        }
    }
    const level = () => {
        // hand_level = hand_level as string
        const level = handlevel.find((hand) => hand.id.toString() == hand_level)
        if (level) {
            return level.name;
        }
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

                    fetchDetail(status, paymentStatus, listT_id, hand_level);
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

                    fetchDetail(status, paymentStatus, listT_id, hand_level);
                } catch (error: any) {
                    console.error(error.message);
                    // Handle any error or display an error message
                }

            }
        })
    }

    const statusOptions = [
        { label: 'ทั้งหมด', value: 'all' },
        { label: 'รอพิจารณา', value: '0' },
        { label: 'ไม่ผ่าน', value: '1' },
        { label: 'ผ่าน', value: '2' },
    ];

    // ตัวเลือกสำหรับสถานะการชำระเงิน
    const paymentStatusOptions = [
        { label: 'ทั้งหมด', value: 'all' },
        { label: 'ยังไม่ชำระ', value: '0' },
        { label: 'รอตรวจสอบ', value: '1' },
        { label: 'ชำระแล้ว', value: '2' },
        { label: 'ปฎิเสธ', value: '3' },
    ];

    const statusSelect = (
        <select
            className=' form-select form-select-sm'
            style={{ maxWidth: 'fit-content' }}
            value={status1}
            onChange={(e) => {
                setStatus1(e.target.value);
                // fetchDetail(status, paymentStatus, listT_id);
                router.query.status = `${e.target.value}`;
                router.push(router);;
            }}
        >
            {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );

    const handLevelSelect = (
        <select
            className=' form-select form-select-sm'
            style={{ maxWidth: 'fit-content' }}
            value={hand_level1}
            onChange={(e) => {
                setHand_level1(e.target.value);
                router.query.hand_level = `${e.target.value}`;
                router.push(router);;
            }}
        >
            <option key={'all'} value={'all'}>
                all
            </option>
            {handlevel.map((option) => (
                <option key={option.name} value={option.id}>
                    {option.name}
                </option>
            ))}
        </select>
    );
    const handLevelEditSelect = (
        <select
            className=' form-select form-select-sm'
            style={{ maxWidth: 'fit-content' }}
            value={team_detail?.hand_level_id}
            onChange={(e) => {
                setTeam_detail({
                    ...team_detail!,
                    hand_level_id: parseInt(e.target.value)
                });
            }}
        >
            {handlevel.map((option) => (
                <option key={option.name} value={option.id}>
                    {option.name}
                </option>
            ))}
        </select>
    );

    const paymentStatusSelect = (
        <select
            className=' form-select form-select-sm'
            style={{ maxWidth: 'fit-content' }}
            value={paymentStatus1}
            onChange={(e) => {
                setPaymentStatus1(e.target.value);
                router.query.paymentStatus = `${e.target.value}`;
                router.push(router);;
            }}
        >
            {paymentStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );

    const isChange = () => {
        if (team_detail == team_detail_check) {
            return true;
        } else {
            return false;
        }
    }
    const showImg = (target: number) => {
        const url = target === 1 ? team_detail?.image_1 : team_detail?.image_2;
        const name = target === 1 ? team_detail?.Name_1 : team_detail?.Name_2;

        if (url !== null && url !== undefined && team_detail != undefined) {
            Swal.fire({
                imageUrl: url,
                imageHeight: 'auto',
                imageAlt: "image",
                showCancelButton: true,
                confirmButtonText: `เปลี่ยนรูป`,
                cancelButtonText: `ปิด`,
                text: `${name}`
            }).then(async (result) => {
                if (result.value) {
                    const { value: file } = await Swal.fire({
                        title: "เลือกภาพใหม่",
                        input: "file",
                        inputAttributes: {
                            "accept": "image/*",
                            "aria-label": "Upload your profile picture"
                        },
                        allowOutsideClick: false,
                    });

                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            Swal.fire({
                                title: name,
                                imageUrl: e.target?.result as string,
                                imageAlt: "The uploaded picture",
                                showCancelButton: true,
                                confirmButtonText: `ยืนยัน`,
                                cancelButtonText: `ยกเลิก`,
                            }).then(async (result) => {
                                if (result.value) {
                                    uploadNewImg(file, team_detail?.id, target);
                                }
                            });
                        };
                        reader.readAsDataURL(file);
                    }
                }
            });
        }
    };


    const uploadNewImg = async (file: any, team_id: number, target: number) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('id', team_id.toString());
        formData.append('target', target.toString());
        
        try {
            Swal.fire({
                title: 'กำลังบันทึก...',
                text: 'โปรดอย่าปิดหน้านี้',
                timerProgressBar: true,
                allowOutsideClick : false,
                allowEscapeKey : false,
                allowEnterKey : false,
                didOpen: () => {
                  Swal.showLoading()
                },
              });
            const response = await fetch(`/api/admin/tournament/updateImg`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                Swal.fire({
                    icon: 'error',
                    title: 'ผิดพลาด',
                    text: 'มีข้อผิดพลาดกรุณาลองใหม่อีกครั้ง',
                })
                return;
            }
            Swal.fire({
                icon: 'success',
                title: 'สำเร็จ',
                text: 'แก้ไขสำเร็จ',
            })
            showDetail(team_id)
        } catch (error) {
            console.error('An error occurred while updating the data:', error);
            throw error;
        }
    }
    const [changeIng, setChangeIng] = useState(false)
    async function updateTournament() {

        try {
            const response = await fetch(`/api/admin/tournament/detail/updateTeam_data`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(team_detail)
            });

            if (!response.ok) {
                Swal.fire({
                    icon: 'error',
                    title: 'ผิดพลาด',
                    text: 'มีข้อผิดพลาดกรุณาลองใหม่อีกครั้ง',
                })
                return;
            }
            Swal.fire({
                icon: 'success',
                title: 'สำเร็จ',
                text: 'แก้ไขสำเร็จ',
            })
            fetchDetail(status, paymentStatus, listT_id, hand_level);
            setShow(false);
        } catch (error) {
            console.error('An error occurred while updating the data:', error);
            throw error;
        }
    }
    return (
        <>
            <Head>
                <title>New register </title>
            </Head>
            <div style={{ textAlign: 'center', margin: 'auto' }}>
                <div className={`mb-1 d-flex ${styles.headerAAAA}`} style={{ justifyContent: 'center', textAlign: 'center', flexWrap: 'wrap' }}>
                    <div className='d-flex flex-row'>

                        <label htmlFor="status" className='text-nowrap mx-2 mt-1'>ผู้สมัครแข่ง :</label>
                        <select
                            className={`text-center form-select form-select-sm`}
                            style={{ maxWidth: 'fit-content' }}
                            id="status"
                            name="status"
                            value={listT_id === undefined ? '' : listT_id}
                            onChange={(e) => {
                                const ID = parseInt(e.target.value);
                                getList_hand_level(ID);
                                fetchDetail(status, paymentStatus, ID, hand_level);
                                router.query.listT_id = `${ID}`
                                router.push(router);
                            }}
                        >
                            {ListournamentOptions}
                        </select>
                    </div>
                    <div className="mt-1 d-flex flex-wrap justify-content-center ">
                        <div className='d-flex flex-row'>
                            <label className='text-nowrap mx-2 mt-1'>สถานะ: </label>
                            {statusSelect}
                        </div>
                        <div className='d-flex flex-row'>
                            <label className='text-nowrap mx-2 mt-1'>ระดับมือ: </label>
                            {handLevelSelect}
                        </div>
                        <div className='d-flex flex-row'>
                            <label className='text-nowrap mx-2 mt-1'>สถานะการชำระเงิน: </label>
                            {paymentStatusSelect}
                        </div>
                    </div>
                </div>
                <div className='bg-primary text-white mb-1'>
                    <span className='text-nowrap mx-2 fs-6 my-2'> ระดับมือ {level()} </span>
                    <span className='text-nowrap mx-2 fs-6 my-2'> ทีมหลัก {main_team()} / {maxteam()}</span>
                    <span className='text-nowrap mx-2 fs-6 my-2'> ทีมสำรอง {reserve_team()} </span>
                </div>


                <div className={styles.container} >
                    <table className={`table table-sm  table-bordered table-striped ${styles.table}`}>
                        <thead className='table-info'>
                            <tr>
                                <th className={styles.onMobile}>#</th>
                                <th className={styles.onMobile}>ชื่อนักกีฬา 1</th>
                                <th className={styles.onMobile}>ทีม/สังกัด</th>
                                <th className={styles.onMobile}>ชื่อนักกีฬา 2</th>
                                <th className={styles.onMobile}>ทีม/สังกัด</th>

                                <th>ผล</th>
                                <th>ชำระเงิน</th>
                                <th>มือ</th>
                                <th>รายละเอียด</th>
                                <th>หมายเหตุ </th>
                                <th>ลบ</th>

                            </tr>
                        </thead>
                        <tbody>

                            {detail_data.map((item, index) => (
                                <tr key={item.id}>
                                    <td className={styles.onMobile}>{index + 1}</td>
                                    <td className={styles.onMobile}>{item.Name_1} ({item.Nickname_1})</td>
                                    <td className={styles.onMobile}>{item.affiliation_1}</td>

                                    <td className={styles.onMobile}>{item.Name_2}  ({item.Nickname_2})</td>
                                    <td className={styles.onMobile}>{item.affiliation_2}</td>

                                    {item.status === 0 && (
                                        <td className="table-warning">พิจารณา</td>
                                    )}
                                    {item.status === 2 && <td className="table-success">ผ่าน</td>}
                                    {item.status === 1 && <td className="table-danger">ไม่ผ่าน</td>}

                                    {item.paymentStatus === 0 && <td className="table-danger">ยังไม่ชำระ</td>}
                                    {item.paymentStatus === 1 && <td className="table-warning">รอตรวจสอบ</td>}
                                    {item.paymentStatus === 2 && <td className="table-success">ชำระแล้ว</td>}
                                    {item.paymentStatus === 3 && <td className="bg-danger text-white">ปฎิเสธสลิป</td>}
                                    <td>{item.hand_level_name}</td>
                                    <td>
                                        <Button variant="primary btn-sm me-1" onClick={() => { showDetail(item.id); setChangeIng(false) }} className={styles.btn}>
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
                                                    <option value="รอตรวจสอบ">รอตรวจสอบ</option>
                                                    <option value="ไม่ผ่าน">ไม่ผ่าน</option>

                                                </select>
                                                <Button className='btn-sm ms-1 ' disabled={newTeam_type === item.team_type} onClick={() => saveteam_type(item)}>Save</Button>
                                                <Button className='btn-sm btn-danger ms-1' onClick={() => setEditTeam_type(false)}>C</Button>

                                            </div>

                                        ) : (
                                            item.team_type === "ทีมหลัก" ? (
                                                <span className='text-success'>ทีมหลัก <Button className='btn-sm fs-6' style={{ padding: '0 5px' }} onClick={() => { setEditTeam_type(true); setSelectEdit_team_type(item.id); setNewTeam_type(item.team_type) }}><AiFillEdit style={{ fontSize: '10px' }} /></Button></span>
                                            ) : (
                                                <span className={`${item.team_type === 'ไม่ผ่าน' ? 'text-danger' : 'text-warning'} `}>{item.team_type} <Button className='btn-sm fs-6' style={{ padding: '0 5px' }} onClick={() => { setEditTeam_type(true); setSelectEdit_team_type(item.id); setNewTeam_type(item.team_type) }}><AiFillEdit style={{ fontSize: '10px' }} /></Button></span>
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
                            {detail_data.length === 0 &&
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
                                {changeIng ? <h5>ระดับมือ  {handLevelEditSelect}</h5> :
                                    <h5>ระดับมือ  {team_detail?.hand_level_name}</h5>}
                            </div>

                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {changeIng ?
                            <div className={styles.wrapper}>
                                <div className={styles.detail}>
                                    <Image src={`${team_detail?.image_1}`} alt="photo" width="200" height="250" />
                                    <div> <span>
                                        ชื่อ
                                        <input
                                            className='w-50'
                                            type="text"
                                            value={team_detail?.Name_1}
                                            onChange={(e) => {
                                                setTeam_detail({
                                                    ...team_detail!,
                                                    Name_1: e.target.value
                                                });
                                            }}
                                        />
                                        (
                                        <input
                                            className='w-25'
                                            type="text"
                                            value={team_detail?.Nickname_1}
                                            onChange={(e) => {
                                                setTeam_detail({
                                                    ...team_detail!,
                                                    Nickname_1: e.target.value
                                                });
                                            }}
                                        />)
                                    </span></div>
                                    <div><span>
                                        อายุ
                                        <input
                                            className='w-25'
                                            type="text"
                                            value={team_detail?.age_1}
                                            onChange={(e) => {
                                                setTeam_detail({
                                                    ...team_detail!,
                                                    age_1: parseInt(e.target.value) || 0
                                                });
                                            }}
                                        /> ปี
                                        : เพศ
                                        <select
                                            name="gender_1"
                                            onChange={(e) => setTeam_detail({
                                                ...team_detail!,
                                                gender_1: e.target.value
                                            })}
                                            value={team_detail?.gender_1}
                                            required
                                        >
                                            <option value="">เลือกเพศ</option>
                                            <option value="ชาย">ชาย</option>
                                            <option value="หญิง">หญิง</option>
                                            <option value="อื่นๆ">อื่นๆ</option>
                                        </select>
                                        {team_detail?.gender_1 === 'อื่นๆ' && (
                                            <div >
                                                <label htmlFor="other_gender1">เพศอื่นๆ</label>
                                                <input
                                                    name="other_gender1"
                                                    type="text"
                                                    placeholder="เพศอื่นๆ"
                                                    onChange={(e) =>
                                                        setGender_1(e.target.value)
                                                    }
                                                    value={gender_1}
                                                    required
                                                />
                                            </div>
                                        )}
                                    </span></div>
                                    <div> <span>
                                        สังกัด
                                        <input
                                            className='w-50'
                                            type="text"
                                            value={team_detail?.affiliation_1}
                                            onChange={(e) => {
                                                setTeam_detail({
                                                    ...team_detail!,
                                                    affiliation_1: e.target.value
                                                });
                                            }}
                                        />
                                    </span></div>
                                    <div> <span>
                                        เบอร์:
                                        <input
                                            className='w-50'
                                            type="text"
                                            maxLength={10}
                                            value={team_detail?.tel_1}
                                            onChange={(e) => {
                                                setTeam_detail({
                                                    ...team_detail!,
                                                    tel_1: e.target.value
                                                });
                                            }}
                                        />
                                    </span></div>

                                </div>
                                <div className={styles.detail}>
                                    <Image src={`${team_detail?.image_2}`} alt="photo" width="200" height="250" />
                                    <div> <span>
                                        ชื่อ
                                        <input
                                            className='w-50'
                                            type="text"
                                            value={team_detail?.Name_2}
                                            onChange={(e) => {
                                                setTeam_detail({
                                                    ...team_detail!,
                                                    Name_2: e.target.value
                                                });
                                            }}
                                        />
                                        (
                                        <input
                                            className='w-25'
                                            type="text"
                                            value={team_detail?.Nickname_2}
                                            onChange={(e) => {
                                                setTeam_detail({
                                                    ...team_detail!,
                                                    Nickname_2: e.target.value
                                                });
                                            }}
                                        />)
                                    </span></div>
                                    <div><span>
                                        อายุ
                                        <input
                                            className='w-25'
                                            type="text"
                                            value={team_detail?.age_2}
                                            onChange={(e) => {
                                                setTeam_detail({
                                                    ...team_detail!,
                                                    age_2: parseInt(e.target.value) || 0
                                                });
                                            }}
                                        /> ปี
                                        : เพศ
                                        <select
                                            name="gender_2"
                                            onChange={(e) => setTeam_detail({
                                                ...team_detail!,
                                                gender_2: e.target.value
                                            })}
                                            value={team_detail?.gender_2}
                                            required
                                        >
                                            <option value="">เลือกเพศ</option>
                                            <option value="ชาย">ชาย</option>
                                            <option value="หญิง">หญิง</option>
                                            <option value="อื่นๆ">อื่นๆ</option>
                                        </select>
                                        {team_detail?.gender_2 === 'อื่นๆ' && (
                                            <div >
                                                <label htmlFor="other_gender1">เพศอื่นๆ</label>
                                                <input
                                                    name="other_gender1"
                                                    type="text"
                                                    placeholder="เพศอื่นๆ"
                                                    onChange={(e) =>
                                                        setGender_2(e.target.value)
                                                    }
                                                    value={gender_2}
                                                    required
                                                />
                                            </div>
                                        )}
                                    </span></div>
                                    <div> <span>
                                        สังกัด
                                        <input
                                            className='w-50'
                                            type="text"
                                            value={team_detail?.affiliation_2}
                                            onChange={(e) => {
                                                setTeam_detail({
                                                    ...team_detail!,
                                                    affiliation_2: e.target.value
                                                });
                                            }}
                                        />
                                    </span></div>
                                    <div> <span>
                                        เบอร์:
                                        <input
                                            className='w-50'
                                            type="text"
                                            maxLength={10}

                                            value={team_detail?.tel_2}
                                            onChange={(e) => {
                                                setTeam_detail({
                                                    ...team_detail!,
                                                    tel_2: e.target.value
                                                });
                                            }}
                                        />
                                    </span></div>

                                </div>
                            </div>
                            :
                            <div className={styles.wrapper}>
                                <div className={styles.detail}>
                                    <Image src={`${team_detail?.image_1}`} alt="photo" width="200" height="250" onClick={() => showImg(1)} style={{ cursor: "pointer" }} />
                                    <div> <span>ชื่อ {team_detail?.Name_1} ({team_detail?.Nickname_1})</span></div>
                                    <div><span>อายุ {team_detail?.age_1} ปี  : เพศ {team_detail?.gender_1}</span></div>
                                    <div> <span>สังกัด {team_detail?.affiliation_1}</span></div>
                                    <div> <span>เบอร์: {team_detail?.tel_1}</span></div>

                                </div>
                                <div className={styles.detail}>
                                    <Image src={`${team_detail?.image_2}`} alt="photo" width="200" height="250" onClick={() => showImg(2)} style={{ cursor: "pointer" }} />
                                    <div><span>ชื่อ {team_detail?.Name_2} ({team_detail?.Nickname_2})</span></div>
                                    <div><span>อายุ {team_detail?.age_2} ปี  : เพศ {team_detail?.gender_2}</span></div>
                                    <div><span>สังกัด {team_detail?.affiliation_2}</span></div>
                                    <div> <span>เบอร์: {team_detail?.tel_2}</span></div>

                                </div>
                            </div>
                        }
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
                            <div className='d-flex justify-content-between'>
                                <div >

                                    {changeIng ? (
                                        <Button variant="primary" disabled={isChange()} onClick={() => { updateTournament(); setChangeIng(false) }}>ยืนยัน</Button>
                                    ) : (
                                        <Button variant="primary" onClick={() => setChangeIng(true)}>แก้ไขข้อมูล</Button>
                                    )
                                    }
                                    {changeIng && (
                                        <Button className='mx-2' variant="danger" onClick={() => setChangeIng(false)}>ยกเลิก</Button>
                                    )}
                                </div>

                                <Button variant="primary" disabled={checkDisabled} onClick={() => updateStatus()}>บันทึกสถานะ</Button>

                            </div>
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
                            {targetSlip?.slipurl ? <Image src={`${targetSlip?.slipurl}`} alt="slip" width={364} height={512} style={{ borderRadius: "13px" }} /> :
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
            </div >

        </>
    )
}

export default Detail