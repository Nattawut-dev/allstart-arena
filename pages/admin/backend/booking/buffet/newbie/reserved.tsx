
import React, { useEffect, useState } from 'react'
import { Button, Modal, Table, Form } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2'
import Head from 'next/head';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import styles from '@/styles/admin/reserved/new_reserved.module.css'
import { utcToZonedTime } from 'date-fns-tz';
import { IsStudentEnum } from '@/enum/StudentPriceEnum';

interface Buffet {
    id: number;
    name: string;
    nickname: string;
    usedate: string;
    phone: string;
    price: number;
    shuttle_cock: number;
    q_id: number;
    q_list: number;
    paymentStatus: number;
    paymentSlip: string;
    paymethod_shuttlecock: string;
    regisDate: string;
    pay_date: string;
    isStudent: number;
}

function BuffetReserved() {
    const [buffetData, setBuffetData] = useState<Buffet[]>([]);
    const [editBuffet, setEditBuffet] = useState<Buffet | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);
    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        fetch('/api/admin/buffet/newbie/get/getall')
            .then((response) => response.json())
            .then((data) => {
                setBuffetData(data);
            })
            .catch((error) => {
                console.error('Error fetching buffet data:', error);
            });
    }

    const status = (status: number) => {
        return <td className='' style={{ backgroundColor: status === 0 ? '#eccccf' : status === 1 ? '#FDCE4E' : status === 2 ? '#d1e7dd' : '#eccccf' }}>
            {status === 0 ? 'ยังไม่ชำระ' : status === 1 ? 'รอตรวจสอบ' : status === 2 ? 'ชำระแล้ว' : 'สลิปไม่ถูกต้อง'}
        </td>
    }

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = buffetData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const slipCheck = (id: number, slip_url: string, price: number) => {
        Swal.fire({
            title: `ยอดชำระ ${price} บาท `,
            showDenyButton: true,
            showCancelButton: true,
            imageUrl: `${slip_url}`,
            confirmButtonText: "อนุมัติ",
            denyButtonText: `สลิปไม่ถูกต้อง`,
            cancelButtonText: `ยกเลิก`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch('/api/admin/buffet/newbie/update_status', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id, status: 2 })
                    });

                    if (!response.ok) {
                        Swal.fire({
                            title: "มีข้อผิดพลาด!",
                            text: "กรุณาลองใหม่อีกครั้ง",
                            icon: "error"
                        });
                        throw new Error('Failed to update data');
                    }
                    loadData();
                    Toast.fire({
                        icon: "success",
                        title: "อนุมัติเรียบร้อย!"
                    });
                } catch (error) {
                    console.error('Error updating data:', error);
                    Swal.fire({
                        title: "มีข้อผิดพลาด!",
                        text: "กรุณาลองใหม่อีกครั้ง",
                        icon: "error"
                    });
                }

            } else if (result.isDenied) {
                try {
                    const response = await fetch('/api/admin/buffet/newbie/update_status', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id, status: 3 })
                    });

                    if (!response.ok) {
                        Swal.fire({
                            title: "มีข้อผิดพลาด!",
                            text: "กรุณาลองใหม่อีกครั้ง",
                            icon: "error"
                        });
                        throw new Error('Failed to update data');
                    }
                    loadData();
                    Toast.fire({
                        icon: "error",
                        title: "ไม่อนุมัติ!"
                    });
                } catch (error) {
                    console.error('Error updating data:', error);
                    Swal.fire({
                        title: "มีข้อผิดพลาด!",
                        text: "กรุณาลองใหม่อีกครั้ง",
                        icon: "error"
                    });
                }

            }
        });
    }
    const saveEdit = () => {

        fetch('/api/admin/buffet/newbie/updateData', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editBuffet),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                loadData();
                Toast.fire({
                    icon: "success",
                    title: "บันทึกสำเร็จ!"
                });
                setEditBuffet(null);
                return response.json();
            })
            .then((data) => {
            })
            .catch((error) => {
                console.error('There was a problem with the fetch operation:', error);
                loadData();
                setEditBuffet(null)
                Toast.fire({
                    icon: "error",
                    title: "มีข้อผิดพลาด!"
                });
            });
    }
    const Delete = (id: number, name: string, nickname: string) => {
        Swal.fire({
            title: `ยืนยันลบการจองของ ${nickname} ?`,
            showCancelButton: true,
            confirmButtonText: "ยืนยัน",
            cancelButtonText: `ยกเลิก`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`/api/admin/buffet/newbie/updateData?id=${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    });

                    if (!response.ok) {
                        Swal.fire({
                            title: "มีข้อผิดพลาด!",
                            text: "กรุณาลองใหม่อีกครั้ง",
                            icon: "error"
                        });
                        throw new Error('Failed to update data');
                    }
                    loadData();
                    Toast.fire({
                        icon: "success",
                        title: "ลบสำเร็จ!"
                    });
                } catch (error) {
                    console.error('Error updating data:', error);
                    Swal.fire({
                        title: "มีข้อผิดพลาด!",
                        text: "กรุณาลองใหม่อีกครั้ง",
                        icon: "error"
                    });
                }

            }


        });

    }
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        getFromSearch(event.target.value);
    };
    const getFromSearch = async (searchTerm: string) => {
        if (!searchTerm) {
            loadData()
        }
        let url = `/api/admin/buffet/newbie/get/get?search=${searchTerm}`
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (response.ok) {
                setBuffetData(data);
            }
        } catch {
            console.log('error');
        }
    }
    const calculate_price = async (id: number) => {
        try {
            const res = await fetch(`/api/admin/buffet/newbie/get/calculate_price?id=${id}`)
            const data = await res.json()
            setEditBuffet({ ...editBuffet!, price: parseInt(data[0].total_shuttle_cock) })
        } catch (error) {

        }
    }

    const dateInBangkok = utcToZonedTime(new Date(), "Asia/Bangkok");

    return (
        <>
            <Head>
                <title>Buffet Reserved</title>
            </Head>
            <div style={{ margin: 'auto', maxWidth: '1000px', overflow: 'auto' }}>
                <h3>รายชื่อผู้จองตีบุฟเฟ่ต์ (มือใหม่)</h3>
                <form className={styles.searchForm}>
                    <input
                        className={styles.searchInput}
                        type="text"
                        placeholder="ชื่อ/เบอร์/วันที่เล่น"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <button className={styles.searchButton} type="submit">
                        Search
                    </button>
                </form>
                <Table striped bordered size='sm' style={{ fontSize: '15px', padding: '0', margin: '0', textAlign: 'center' }}>
                    <thead className='table-primary'>
                        <tr>
                            <th>#</th>
                            <th>ชื่อเล่น</th>
                            <th>โทรศัพท์</th>
                            <th>วันที่เล่น</th>
                            <th>สถานะ</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((buffet, index) => (
                            <tr key={index + indexOfFirstItem + 1}>
                                <td>{index + indexOfFirstItem + 1}</td>
                                <td>{buffet.nickname}</td>
                                <td>{buffet.phone}</td>
                                <td>{buffet.usedate}</td>
                                {status(buffet.paymentStatus)}
                                {/* {shuttle_cock_status(buffet.paymethod_shuttlecock)} */}
                                <td className='d-flex justify-content-around'>
                                    <Button className='btn btn-sm' onClick={() => slipCheck(buffet.id, buffet.paymentSlip, buffet.price)} disabled={!buffet.paymentSlip}>Slip Check </Button>
                                    <Button className='btn btn-warning btn-sm' onClick={() => setEditBuffet(buffet)}>Edit</Button>
                                    <Button className='btn btn-danger btn-sm' onClick={() => Delete(buffet.id, buffet.name, buffet.nickname)}>Delete </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <ul className='pagination'>
                    {Array.from({ length: Math.ceil(buffetData.length / itemsPerPage) }, (_, i) => (
                        <li key={i} className='page-item'>
                            <button onClick={() => paginate(i + 1)} className='page-link' style={{ backgroundColor: (i + 1) == currentPage ? '#0d6efd' : '', color: (i + 1) == currentPage ? 'white' : '' }}>
                                {i + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <Modal show={editBuffet !== null} onHide={() => setEditBuffet(null)} centered keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Buffet</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editBuffet && (

                        <Form>

                            <Form.Group controlId="formNickname">
                                <Form.Label>ชื่อเล่น</Form.Label>
                                <Form.Control type="text" value={editBuffet.nickname} onChange={(e) => setEditBuffet({ ...editBuffet, nickname: e.target.value })} />
                            </Form.Group>
                            <Form.Group controlId="formPhone">
                                <Form.Label>เบอร์</Form.Label>
                                <Form.Control type="string" maxLength={10} value={editBuffet.phone} onChange={(e) => setEditBuffet({ ...editBuffet, phone: e.target.value })} />
                            </Form.Group>
                            <div className={`${styles.checkbox_wrapper} d-flex mt-3 mb-3 mx-2`}>
                                <input type="checkbox" id="cbtest-19" value={editBuffet.isStudent } onChange={(e) => setEditBuffet({ ...editBuffet, isStudent: e.target.checked ? IsStudentEnum.Student_University : IsStudentEnum.None })} checked={editBuffet.isStudent == IsStudentEnum.Student_University} />
                                <label htmlFor="cbtest-19" className='mx-2'> นักเรียน / นักศึกษา</label>
                            </div>
                            <Form.Group controlId="formShuttleCock">
                                <Form.Label>จำนวนลูก</Form.Label>
                                <Form.Control type="number" value={editBuffet.shuttle_cock} onChange={(e) => setEditBuffet({ ...editBuffet, shuttle_cock: parseInt(e.target.value) })} />
                            </Form.Group>
                            <Form.Group controlId="formPrice">
                                <Form.Label>ยอดรวม สนาม + ลูก </Form.Label>
                                <div className='d-flex'>
                                    <Form.Control className='w-100' type="number" value={editBuffet.price} onChange={(e) => setEditBuffet({ ...editBuffet, price: parseInt(e.target.value) })} />
                                    <div className="input-group-append">
                                        <button className="btn btn-outline-secondary" type="button" onClick={() => calculate_price(editBuffet.id)}>คำนวณ</button>
                                    </div>
                                </div>

                            </Form.Group>
                            <Form.Group controlId="formPrice">
                                <Form.Label>
                                    สถานะชำระเงิน
                                    {/* <span className='text-danger'>*เว้นว่างถ้าลูกค้าชำระเอง</span> */}
                                </Form.Label>
                                <Form.Control
                                    as="select"
                                    value={editBuffet.paymethod_shuttlecock}
                                    onChange={(e) => setEditBuffet({ ...editBuffet, paymethod_shuttlecock: e.target.value })}
                                    readOnly
                                >
                                    <option value={0}>ยังไม่ชำระ</option>
                                    <option value={1}>โอนผ่านแอดมิน</option>
                                    <option value={2}>เงินสดผ่านแอดมิน</option>
                                    <option value={3}>โอนด้วยตนเอง</option>
                                    <option value={4}>เล่นเสร็จยังไม่ชำระ</option>

                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formUsedate" style={{ width: '100%' }}>
                                <Form.Label>วันที่เล่น</Form.Label>
                                <div style={{ width: '100%' }}>
                                    <DatePicker
                                        className='w-100'
                                        selected={editBuffet.usedate ? new Date(editBuffet.usedate) : null}
                                        onChange={(date) => date && setEditBuffet({ ...editBuffet, usedate: format(date, 'dd MMMM yyyy') })}
                                        dateFormat="dd MMMM yyyy"
                                    />
                                </div>
                            </Form.Group>
                            <Form.Group controlId="formUsedate" style={{ width: '100%' }}>
                                <Form.Label>วันที่ชำระเงิน **วันที่นำยอดไปรวมในหน้าสรุปยอด</Form.Label>
                                <div style={{ width: '100%' }}>
                                    <DatePicker
                                        className='w-100'
                                        selected={editBuffet.usedate ? new Date(editBuffet.pay_date) : null}
                                        onChange={(date) => date && setEditBuffet({ ...editBuffet, pay_date: format(date, 'dd MMMM yyyy') })}
                                        dateFormat="dd MMMM yyyy"
                                    />
                                    <Button className='mx-3' onClick={() => setEditBuffet({ ...editBuffet, pay_date: format(dateInBangkok, 'dd MMMM yyyy') })}> วันนี้</Button>
                                </div>
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setEditBuffet(null)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => saveEdit()}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default BuffetReserved;

