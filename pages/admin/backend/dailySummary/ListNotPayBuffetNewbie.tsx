
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
import { buffetPaymentStatusEnum } from '@/enum/buffetPaymentStatusEnum';
import { customerPaymentStatusEnum } from '@/enum/customerPaymentStatusEnum';
import CustomTable from '@/components/table/customTable';
import useDebounce from '@/pages/hook/use-debounce';
import { OptionType } from '@/components/admin/AbbreviatedSelect';
import { IShuttlecockDetails } from '@/interface/buffet';
import ShuttleCockControlNewBie from '../booking/buffet/newbie/ShuttleCockControlNewBie';
import { ShuttleCockTypes } from '../booking/buffet';
import ShuttleCockControl from '../booking/buffet/ShuttleCockControl';
import { PaymethodShuttlecockEnum } from '@/enum/paymethodShuttlecockEnum';
import { PayByEnum } from '@/enum/payByEnum';

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
    isStudent: IsStudentEnum;
    total_shuttle_cock?: number;
    shoppingMoney?: string;
    total_price?: string;
    total_items: number;
    court_price: number;
    shuttlecock_details: IShuttlecockDetails[];
    shuttlecock_total_price: number;
}

interface Props {
    date: string;
    mode: "normal" | "newbie"; // <<< เพิ่ม mode
}

function ListNotPayBuffetNewbie({ date, mode }: Props) {
    const [buffetData, setBuffetData] = useState<Buffet[]>([]);
    const [editBuffet, setEditBuffet] = useState<Buffet | null>(null);
    const [shuttleCockTypes, setShuttleCockTypes] = useState<OptionType[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);
    const [total_items, setTotal_items] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    let baseUrl = mode === "normal" ? "/api/admin/buffet" : "/api/admin/buffet/newbie";

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        // getFromSearch(event.target.value);
    };

    useEffect(() => {
        loadData();
    }, [currentPage, debouncedSearchTerm]); // โหลดใหม่เมื่อ currentPage เปลี่ยน

    const loadData = () => {
        setLoading(true);
        setBuffetData([]);

        fetch(`${baseUrl}/get/getNotpay_buffet?usedate=${date}&page=${currentPage}&limit=${itemsPerPage}&search=${debouncedSearchTerm}`)
            .then((response) => response.json())
            .then((data) => {
                setBuffetData(data.data);
                setTotal_items(data.totalItems);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching buffet data:', error);
                setLoading(false);
            });
    };

    useEffect(() => {
        getShuttleCockTypes()
    }, [])

    const getByID = (id?: number) => {
        const buffetId = id ? id : editBuffet?.id;
        fetch(`${baseUrl}/get/get_by_id?id=${buffetId}`)
            .then((response) => response.json())
            .then((data) => {
                setEditBuffet(data.data);
            })
            .catch((error) => {
                console.error('Error fetching buffet data:', error);
            });
    }

    const getShuttleCockTypes = async () => {
        try {
            const response = await fetch(`${baseUrl}/get_shuttlecock_types`);
            if (response.ok) {
                const data = await response.json();
                const formattedData = data.map((item: ShuttleCockTypes) => ({
                    id: item.id,
                    label: `${item.name} - ${item.price}฿/ลูก (คนละ ${item.price / 4}฿)`,
                    code: item.code,
                    name: item.name,
                    price: item.price,
                }));
                setShuttleCockTypes(formattedData);
            } else {
                console.error('Failed to fetch shuttlecock types.');
            }
        } catch (error) {
            console.error('Error occurred while fetching shuttlecock types:', error);
        }
    }


    const totalPages = Math.ceil(total_items / itemsPerPage);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const status = (status: number) => {
        return <div className='text-center' style={{ borderRadius: '8px', backgroundColor: status === 0 ? '#eccccf' : status === 1 ? '#FDCE4E' : status === 2 ? '#d1e7dd' : '#eccccf' }}>
            {status === 0 ? 'ยังไม่ชำระ' : status === 1 ? 'รอตรวจสอบ' : status === 2 ? 'ชำระแล้ว' : 'สลิปไม่ถูกต้อง'}
        </div>
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

    const getDataPriceById = async (buffetId: number): Promise<Buffet | null> => {
        try {
            const response = await fetch(`${baseUrl}/get/get_by_id?id=${buffetId}`);
            const data = await response.json();
            return data.data as Buffet;
        } catch (error) {
            console.error('Error fetching buffet data:', error);
            return null;
        }
    }

    const slipCheck = async (id: number, slip_url: string) => {
        const buffetData = await getDataPriceById(id);
        if (!buffetData) {
            return;
        }
        Swal.fire({
            title: `ยอดชำระ ${buffetData.total_price} บาท `,
            showDenyButton: true,
            showCancelButton: true,
            imageUrl: `${slip_url}`,
            confirmButtonText: "อนุมัติ",
            denyButtonText: `สลิปไม่ถูกต้อง`,
            cancelButtonText: `ยกเลิก`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${baseUrl}/update_status`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id, status: buffetPaymentStatusEnum.PAID, customerPaymentStatus: customerPaymentStatusEnum.PAID })
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
                    const response = await fetch(`${baseUrl}/update_status`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id, status: buffetPaymentStatusEnum.REJECT, customerPaymentStatus: customerPaymentStatusEnum.REJECT })
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

        fetch(`${baseUrl}/updateData`, {
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
                    const response = await fetch(`${baseUrl}/updateData?id=${id}`, {
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

    const payMethod = async (id: any, method: string, paymethodShuttlecock: PaymethodShuttlecockEnum, pay_by: PayByEnum) => {
        Swal.fire({
            title: `รับชำระด้วย ${method}?`,
            text: `ลูกค้าชำระค่าสินค้า/บริการด้วย ${method} ทั้งหมด ${editBuffet?.total_price} บาท`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const courtPrice = editBuffet?.total_price ?? 0;
                try {
                    const response = await fetch(`${baseUrl}/pay_shuttle_cock`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id, paymethodShuttlecock, courtPrice, pay_by })
                    });

                    if (!response.ok) {
                        throw new Error('Failed to update data');
                    }

                    Swal.fire({
                        title: "บันทึกสำเร็จ!",
                        icon: "success"
                    });
                    loadData();
                    setEditBuffet(null);
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


    const dateInBangkok = utcToZonedTime(new Date(), "Asia/Bangkok");

    const [isStudent, setIsStudent] = useState(IsStudentEnum.None);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value as IsStudentEnum;
        const newIsStudent = value === isStudent ? IsStudentEnum.None : value;
        setIsStudent(newIsStudent);
        if (editBuffet) {
            setEditBuffet({
                ...editBuffet,
                isStudent: newIsStudent
            } as Buffet);
        }
    };

    const columns = [
        {
            label: 'ชื่อเล่น',
            key: 'nickname',
        },
        {
            label: 'โทรศัพท์',
            key: 'phone',
        },
        {
            label: 'วันที่เล่น',
            key: 'usedate',
            formatter: (cell: any, row: any) => new Date(row.usedate).toLocaleDateString('th-TH')
        },
        {
            label: 'สถานะ',
            key: 'paymentStatus',
            formatter: (cell: any, row: any) => status(row.paymentStatus)
        },
        {
            label: 'Actions',
            key: 'actions',
            formatter: (cell: any, row: Buffet) => (
                <div className='d-flex justify-content-around'>
                    <Button
                        className='btn btn-sm'
                        onClick={() => slipCheck(row.id, row.paymentSlip)}
                        disabled={!row.paymentSlip}
                    >
                        เช็คสลิป
                    </Button>
                    <Button
                        className='btn btn-warning btn-sm'
                        onClick={() => getByID(row.id)}
                    >
                        แก้ไข
                    </Button>
                    <Button
                        className='btn btn-danger btn-sm'
                        onClick={() => Delete(row.id, row.name, row.nickname)}
                    >
                        ลบ
                    </Button>
                </div>
            )
        },
    ];


    return (
        <>
            <Head>
                <title>Buffet Reserved</title>
            </Head>
            <div style={{ margin: 'auto', maxWidth: '1000px', overflow: 'auto' }}>
                <h3>รายชื่อผู้ยังไม่ชำระเงิน วันที่ {date}</h3>
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
                <CustomTable
                    data={buffetData}
                    columns={columns}
                    isLoading={loading}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    isShowPagination
                />

            </div>
            <Modal
                show={editBuffet !== null}
                onHide={() => setEditBuffet(null)}
                centered
                keyboard={false}
                fullscreen="sm-down"
            >
                <Modal.Header closeButton>
                    <Modal.Title>แก้ไขข้อมูล</Modal.Title>
                </Modal.Header>
                <Modal.Body className='modal-scroll-body' >
                    {editBuffet && (
                        <div >
                            <Form>
                                <Form.Group controlId="formNickname">
                                    <Form.Label>ชื่อเล่น</Form.Label>
                                    <Form.Control type="text" value={editBuffet.nickname} onChange={(e) => setEditBuffet({ ...editBuffet, nickname: e.target.value })} />
                                </Form.Group>
                                <Form.Group controlId="formPhone">
                                    <Form.Label>เบอร์</Form.Label>
                                    <Form.Control type="string" maxLength={10} value={editBuffet.phone} onChange={(e) => setEditBuffet({ ...editBuffet, phone: e.target.value })} />
                                </Form.Group>
                                <div className={`${styles.checkbox_wrapper} d-flex mt-3`}>
                                    <input
                                        type="checkbox"
                                        id="cbtest-19-1"
                                        value={IsStudentEnum.Student}
                                        onChange={handleCheckboxChange}
                                        checked={editBuffet.isStudent == IsStudentEnum.Student}
                                    />
                                    <label htmlFor="cbtest-19-1" className={styles.check_box}></label>
                                    <p className="mx-2" style={{ padding: '0' }}>นักเรียน </p>
                                </div>
                                <div className={`${styles.checkbox_wrapper} d-flex`}>
                                    <input
                                        type="checkbox"
                                        id="cbtest-19-2"
                                        value={IsStudentEnum.University}
                                        onChange={handleCheckboxChange}
                                        checked={editBuffet.isStudent === IsStudentEnum.University}
                                    />
                                    <label htmlFor="cbtest-19-2" className={styles.check_box}></label>
                                    <p className="mx-2" style={{ padding: '0' }}>นักศึกษา</p>
                                </div>

                                <div style={{ backgroundColor: '#e5fffb', padding: '10px', borderRadius: '8px' }}>
                                    <p className='text-center' style={{ backgroundColor: "#4ef3fc", borderRadius: '8px' }}>ส่วนจำนวนลูกกดเปลี่ยนแล้วมีผลทันที</p>
                                    {shuttleCockTypes.map((type) => {
                                        const matched = editBuffet?.shuttlecock_details?.find(
                                            (detail) => detail.shuttlecock_type_id === type.id
                                        );
                                        const quantity = matched?.quantity || 0;

                                        return (
                                            <div key={type.id} className="d-flex justify-content-between align-items-center">
                                                <p className="mb-0">{type.label}</p>
                                                {mode === "normal" ? (
                                                    <ShuttleCockControl
                                                        buffetId={editBuffet?.id!}
                                                        shuttlecockTypeId={type.id}
                                                        initialQty={quantity}
                                                        onUpdated={getByID}
                                                    />
                                                ) : (
                                                    <ShuttleCockControlNewBie
                                                        buffetId={editBuffet?.id!}
                                                        shuttlecockTypeId={type.id}
                                                        initialQty={quantity}
                                                        onUpdated={getByID}
                                                    />
                                                )}

                                            </div>
                                        );
                                    })}
                                </div>
                                <Form.Group controlId="formPrice" className='mt-2'>
                                    <Form.Label>รวมค่าลูก (หาร 4 แล้ว) </Form.Label>
                                    <div className='d-flex'>
                                        <Form.Control className='w-100' readOnly type="number" value={editBuffet.shuttlecock_total_price} />
                                    </div>
                                </Form.Group>

                                <Form.Group controlId="formPrice">
                                    <Form.Label>ค่าสนาม </Form.Label>
                                    <div className='d-flex'>
                                        <Form.Control className='w-100' readOnly type="number" value={editBuffet.court_price} />
                                    </div>
                                </Form.Group>

                                <Form.Group controlId="formPrice">
                                    <Form.Label>ยอดซื้อของ </Form.Label>
                                    <div className='d-flex'>
                                        <Form.Control className='w-100' readOnly type="number" value={editBuffet.shoppingMoney} />
                                    </div>
                                </Form.Group>
                                <Form.Group controlId="formPrice">
                                    <Form.Label>ยอดรวม สนาม + ลูก + ซื้อของ </Form.Label>
                                    <div className='d-flex'>
                                        <Form.Control className='w-100' type="number" readOnly value={editBuffet.total_price} onChange={(e) => setEditBuffet({ ...editBuffet, price: parseInt(e.target.value) })} />
                                        {/* <div className="input-group-append">
                                           <button className="btn btn-outline-secondary" type="button" onClick={() => calculate_price(editBuffet.id)}>คำนวณ</button>
                                       </div> */}
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
                                        disabled
                                    >
                                        <option value={0}>ยังไม่ชำระ</option>
                                        <option value={1}>โอนผ่านแอดมิน</option>
                                        {/* <option value={2}>เงินสดผ่านแอดมิน</option> */}
                                        <option value={3}>โอนด้วยตนเอง</option>
                                        <option value={4}>เล่นเสร็จยังไม่ชำระ</option>
                                        <option value={5}>ชำระแล้วผ่าน POS</option>

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
                                            selected={editBuffet.pay_date ? new Date(editBuffet.pay_date) : null}
                                            onChange={(date) => date && setEditBuffet({ ...editBuffet, pay_date: format(date, 'dd MMMM yyyy') })}
                                            dateFormat="dd MMMM yyyy"
                                        />
                                        <Button className='mx-3' onClick={() => setEditBuffet({ ...editBuffet, pay_date: format(dateInBangkok, 'dd MMMM yyyy') })}> วันนี้</Button>
                                    </div>
                                </Form.Group>
                            </Form>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className='d-flex justify-content-between'>
                    <div>
                        รับชำระ
                        <Button className='btn btn-success' hidden onClick={() => payMethod(editBuffet?.id, "เงินสด", PaymethodShuttlecockEnum.CASH_ADMIN, PayByEnum.CASH)} >ผ่านเงินสด</Button>
                        <Button className='mx-2' onClick={() => payMethod(editBuffet?.id, "โอนเงิน", PaymethodShuttlecockEnum.TRANSFER_ADMIN, PayByEnum.TRANSFER)} >ผ่านการโอน</Button>
                    </div>
                    <div >
                    <Button variant="secondary me-2" onClick={() => setEditBuffet(null)}>
                        ปิด
                    </Button>
                    <Button variant="primary" onClick={() => saveEdit()}>
                        บันทึก
                    </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>

    )
}

export default ListNotPayBuffetNewbie;

