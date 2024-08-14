import React, { useCallback, useEffect, useState } from 'react';
import { format, addDays } from 'date-fns';
import Image from 'next/image';
import { Button, Modal, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2'
import Head from 'next/head';
import styles from '@/styles/infoBuffet.module.css'
import { utcToZonedTime } from 'date-fns-tz';
import { GetServerSideProps } from 'next';
import {IsStudentEnum } from '@/enum/StudentPriceEnum';
import { ISales } from '@/interface/sales';
import { paymentStatusEnum } from '@/enum/paymentStatusEnum';
import { PaymentTypeEnum } from '@/enum/stateCashierEnum';
import { buffetStatusEnum } from '@/enum/buffetStatusEnum';
import { IBuffet } from '@/interface/buffet';
import { IBuffet_setting } from '@/interface/buffetSetting';
import { buffetPaymentStatusEnum } from '@/enum/buffetPaymentStatusEnum';
import SaleDetailModal from '@/components/modal/saleDetailModal';

interface Props {
    buffetSetting: IBuffet_setting;
    buffetStudentSetting: IBuffet_setting;
    buffetUniversitySetting: IBuffet_setting;
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
    try {
        const response = await fetch(`${process.env.HOSTNAME}/api/buffet/get_setting`);
        const buffetSetting = await response.json();
        return {
            props: {
                buffetSetting: buffetSetting[0],
                buffetStudentSetting: buffetSetting[1],
                buffetUniversitySetting: buffetSetting[2],
            },

        };
    } catch (error) {
        console.error('Failed to fetch data:', error);
        return {
            props: {
                buffetSetting: [],
                buffetStudentSetting: [],
                buffetUniversitySetting: [],
            },
        };
    }
}

function Infobuffet({ buffetSetting, buffetStudentSetting, buffetUniversitySetting }: Props) {
    const [buffets, setBuffets] = useState<IBuffet[]>([]);
    const dateInBangkok = utcToZonedTime(new Date(), "Asia/Bangkok");
    const [show, setShow] = useState(false);
    const [buffetSelcted, setBuffetSelcted] = useState<IBuffet>();
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imgUrl, setImgUrl] = useState('')
    const [price, setPrice] = useState(0)
    const [salesData, setSalesData] = useState<ISales[]>([]);
    const [isSalesDataLoading, setIsSalesDataLoading] = useState(true);
    const [showSaleDetailModal, setShowSaleDetailModal] = useState(false);

    const fetchbuffet = async () => {
        try {
            const res = await fetch(`/api/buffet/get`)
            const data = await res.json()
            if (res.ok) {
                setBuffets(data)
            } else {
                Swal.fire({
                    title: 'เกิดข้อผิดพลาด',
                    icon: 'error',
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }

    }
    useEffect(() => {
        fetchbuffet();
    }, [])

    const showSlipImg = () => {
        Swal.fire({
            imageUrl: "/QR_Buffet.jpg",
            imageHeight: 300,
            imageAlt: "Slip สำหรับชำระเงิน"
        });
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setSelectedFile(file);

            // Preview the selected image
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && typeof event.target.result === 'string') {
                    const imageUrl = event.target.result;
                    setImgUrl(imageUrl);
                }

                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleUpload = async () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('id', buffetSelcted!.id.toString());

            try {
                Swal.fire({
                    title: 'กำลังบันทึก...',
                    text: 'โปรดอย่าปิดหน้านี้',
                    timerProgressBar: true,
                    allowOutsideClick: false,

                    didOpen: () => {
                        Swal.showLoading();
                    },
                });
                const response = await fetch('/api/buffet/add', {
                    method: 'PUT',
                    body: formData,
                });


                if (response.ok) {
                    setShow(false);

                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'บันทึกสำเร็จ',
                        showConfirmButton: false,
                        timer: 900,
                    }).then(() => {
                        fetchbuffet()
                        setSelectedFile(null);
                        setPreviewImage(null);
                    })

                } else {
                    console.error('Error:', response.statusText);
                }
            } catch (error) {
                console.error('Error:', error);
            }

        }
    };
    const confirm = () => {
        Swal.fire({
            title: `ต้องการส่งภาพสลิปนี้ ?`,
            imageUrl: imgUrl,
            imageHeight: 250,
            imageWidth: 200,
            showCancelButton: true,
            cancelButtonText: "ยกเลิก",
            confirmButtonText: 'ตกลง',

        }).then((result) => {
            if (result.isConfirmed) {
                handleUpload();
            } else {
                console.log('User canceled the action.');
            }
        })
    }
    const [summaryContent, setSummaryContent] = useState<React.ReactNode | null>(null);

    const calculateSummary = async (buffet_id: number) => {
        try {
            const res = await fetch(`/api/buffet/getone?id=${buffet_id}`)
            const data = await res.json()
            if (res.ok) {
                const buffet: IBuffet = data[0]
                setBuffetSelcted(buffet);
                if (buffet) {
                    const shoppingMoney = Number(buffet?.pendingMoney ?? 0);
                    if (buffet.isStudent === IsStudentEnum.Student) {
                        const calculatePricePerOne = buffetStudentSetting?.shuttle_cock_price / 4
                        const calculatedPrice = buffetStudentSetting.court_price + (buffet?.shuttle_cock * calculatePricePerOne) + shoppingMoney;
                        setPrice(calculatedPrice);
                        setSummaryContent(
                            <div>
                                {`${buffetStudentSetting.court_price} +  (${buffet?.shuttle_cock} * ${calculatePricePerOne}) ${buffet?.pendingMoney ? `+ ${buffet?.pendingMoney}` : ''}`} บาท
                            </div>
                        );
                    } else if (buffet.isStudent === IsStudentEnum.University) {
                        const calculatePricePerOne = buffetUniversitySetting?.shuttle_cock_price / 4
                        const calculatedPrice = buffetUniversitySetting.court_price + (buffet?.shuttle_cock * calculatePricePerOne) + shoppingMoney;
                        setPrice(calculatedPrice);
                        setSummaryContent(
                            <div>
                                {`${buffetUniversitySetting.court_price} +  (${buffet?.shuttle_cock} * ${calculatePricePerOne})  ${buffet?.pendingMoney ? `+ ${buffet?.pendingMoney}` : ''}`} บาท
                            </div>
                        );
                    } else {
                        const calculatePricePerOne = buffetSetting?.shuttle_cock_price / 4
                        const calculatedPrice = buffetSetting.court_price + (buffet?.shuttle_cock * calculatePricePerOne) + shoppingMoney;
                        setPrice(calculatedPrice);
                        setSummaryContent(
                            <div>
                                {`${buffetSetting.court_price} + (${buffet?.shuttle_cock} * ${calculatePricePerOne}) ${buffet?.pendingMoney ? `+ ${buffet?.pendingMoney}` : ''}`} บาท
                            </div>
                        );
                    }
                    setShow(true);
                } else {
                    setSummaryContent(
                        <div style={{ color: 'red' }}>
                            มีข้อผิดพลาด
                        </div>
                    );
                }
            } else {
                Swal.fire({
                    title: 'เกิดข้อผิดพลาด',
                    icon: 'error',
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }

    };

    const getSalesData = async (buffet_id: number) => {
        try {
            setSalesData([]);
            setIsSalesDataLoading(true);
            const response = await fetch(`/api/get-by-customer?buffetId=${buffet_id}&buffetStatus=${buffetStatusEnum.BUFFET}`);
            const data = await response.json();
            if (response.status === 404) {
                return;
            }
            if (!response.ok) {
                Swal.fire({
                    icon: 'error',
                    title: 'ไม่พบข้อมูล'
                })
            }
            setSalesData(data.sales);
            setShow(false);
            setShowSaleDetailModal(true);
        } catch (error) {
            console.error('Error fetching salesDetail:', error);
        } finally {
            setIsSalesDataLoading(false);

        }
    };


    const handleCloseDetailModal = () => {
        setShowSaleDetailModal(false);
        setShow(true);
    }
    // -------------------------------------------------------------------------------------------------------------------
    return (
        <>
            <div className={styles.container} style={{ overflow: 'auto' }}>
                <Head>
                    <title>ข้อมูลตีบุีฟเฟ่ต์</title>
                </Head>

                <h5 className={styles.title}>ข้อมูลการจองตีบุ๊ฟเฟต์ วันที่ <span style={{ color: 'red' }}>{format(dateInBangkok, 'dd MMMM yyyy')}</span></h5>
                <div className={`${styles['table-container']}`}>
                    <span>ทั้งหมด {buffets.length} รายการ</span>
                    <table className={`table  table-bordered table-striped table-striped`}>
                        <thead className={'table-primary'} style={{ backgroundColor: 'red' }}>
                            <tr>
                                <th>#</th>
                                <th>รหัสลูกค้า</th>
                                <th>ชื่อเล่น</th>
                                <th>จำนวนลูก</th>
                                <th>สถานะ</th>
                                <th>ชำระเงิน</th>
                            </tr>
                        </thead>
                        <tbody>
                            {buffets
                                .map((buffet, index) => {
                                    return (
                                        <tr key={buffet.id}>
                                            <td>{index + 1}</td>
                                            <td>{buffet.barcode}</td>
                                            <td>{buffet.nickname}</td>
                                            <td>{buffet.shuttle_cock}</td>
                                            <td className='' style={{ backgroundColor: buffet.paymentStatus === buffetPaymentStatusEnum.PENDING ? '#eccccf' : buffet.paymentStatus === buffetPaymentStatusEnum.CHECKING ? '#FDCE4E' : buffet.paymentStatus === buffetPaymentStatusEnum.PAID ? '#d1e7dd' : '#eccccf' }}>
                                                {buffet.paymentStatus === buffetPaymentStatusEnum.PENDING ? 'ยังไม่ชำระ' : buffet.paymentStatus === buffetPaymentStatusEnum.CHECKING ? 'รอตรวจสอบ' : buffet.paymentStatus === buffetPaymentStatusEnum.PAID ? 'ชำระแล้ว' : 'สลิปไม่ถูกต้อง'}
                                            </td>
                                            <td><Button className='btn btn-sm' onClick={() => { calculateSummary(buffet.id); }}>ชำระเงิน</Button></td>
                                        </tr>

                                    );
                                })}
                            {buffets.length === 0 &&
                                <tr>
                                    <td colSpan={6}>ยังไม่มีการจอง</td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>

            </div>
            <Modal
                contentClassName={styles.Modal}
                show={show}
                onHide={() => { setShow(false); setSelectedFile(null); setPreviewImage(null) }}
                backdrop="static"
                keyboard={false}
                centered
                size='lg'
                dialogClassName={styles.Modal1}
            // scrollable={true}
            >
                <Modal.Header closeButton >
                    <Modal.Title>ข้อมูลการจองตีก๊วน / ชำระเงิน  {buffetSelcted?.isStudent === IsStudentEnum.Student ? <h6>นักเรียน</h6> : buffetSelcted?.isStudent === IsStudentEnum.University ? <h6>นักศึกษา</h6> : ''}</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <div>
                        <div className={styles.wrapper1}>
                            <div className={styles.img}>
                                <Image src={previewImage ? previewImage : '/QR_Buffet.jpg'} alt="QR_Buffet" width="280" height="280" onClick={() => showSlipImg()} />
                                {buffetSelcted?.paymentStatus !== buffetPaymentStatusEnum.PENDING && (
                                    <div style={{ textAlign: "center" }}>
                                        {buffetSelcted?.paymentStatus === buffetPaymentStatusEnum.CHECKING && (
                                            <div><h5> สถานะ  <span style={{ color: 'orange' }}>กำลังตรวจสอบสลิป</span></h5></div>

                                        )}
                                        {buffetSelcted?.paymentStatus === buffetPaymentStatusEnum.PAID && (

                                            <div><h5> สถานะ   <span style={{ color: 'green' }}>ชำระเงินสำเร็จ</span></h5></div>
                                        )}
                                        {buffetSelcted?.paymentStatus === buffetPaymentStatusEnum.REJECT && (

                                            <div><h5> สถานะ   <span style={{ color: 'red' }}>ปฏิเสธสลิป</span></h5></div>
                                        )}
                                    </div>

                                )}
                            </div>
                            <div className={styles.detail}>
                                <div className={styles.wrapper}>
                                    <p>ชื่อลูกค้า</p>
                                    <p>{buffetSelcted?.nickname}</p>
                                </div>
                                <div className={styles.wrapper}>
                                    <p>วันที่เล่น</p>
                                    <p>{buffetSelcted?.usedate}</p>
                                </div>
                                <div className={styles.wrapper}>
                                    <p>จำนวนลูก</p>
                                    <p>{buffetSelcted?.shuttle_cock} ลูก</p>
                                </div>

                                <div className={styles.wrapper}>
                                    <p>ค่าสนาม</p>
                                    {/* <p>{buffetSetting?.court_price} บาท / คน</p> */}
                                    <p>{buffetSelcted?.isStudent === IsStudentEnum.Student ? buffetStudentSetting.court_price : buffetSelcted?.isStudent === IsStudentEnum.University ? buffetUniversitySetting.court_price : buffetSetting?.court_price} บาท / คน</p>

                                </div>
                                <div className={styles.wrapper}>
                                    <p>ราคาลูก</p>
                                    {/* <p>{`${buffetSetting?.shuttle_cock_price} / 4  = ${buffetSetting?.shuttle_cock_price / 4}`} บาท /คน/ลูก</p> */}
                                    <p>{buffetSelcted?.isStudent === IsStudentEnum.Student ? buffetStudentSetting.shuttle_cock_price : buffetSelcted?.isStudent === IsStudentEnum.University ? buffetUniversitySetting.shuttle_cock_price : buffetSetting?.shuttle_cock_price} บาท</p>
                                </div>
                                {buffetSelcted?.pendingMoney &&
                                    <div className={styles.wrapper}>
                                        <p>สินค้าที่ซื้อ</p>
                                        {/* <p>{`${buffetSetting?.shuttle_cock_price} / 4  = ${buffetSetting?.shuttle_cock_price / 4}`} บาท /คน/ลูก</p> */}
                                        <a className={styles.a} onClick={() => getSalesData(buffetSelcted.id)}>{buffetSelcted?.pendingMoney} บาท</a>
                                    </div>}


                                <div className={styles.wrapper}>
                                    <p>ราคารวม</p>
                                    <p>{summaryContent}</p>
                                </div>
                                <h4 style={{ textAlign: "center" }}>
                                    ทั้งหมด <span style={{ color: 'red' }}>{price}</span> บาท
                                </h4>
                                <span style={{ color: 'red', textAlign: "center" }}>หากโอนแล้วกรุณาแนบสลิปเมนูข้างล่าง</span>
                                <span style={{ color: 'red', textAlign: "center" }}>**โปรดชำระหลังเล่นเสร็จแล้วเท่านั้น**</span>

                            </div>
                        </div>

                    </div>
                </Modal.Body>
                <Modal.Footer  >
                    <div className={styles.footer1}>
                        <div className={styles.btn1}><Button className='btn-info '><a href="/QR_Buffet.jpg" download="QR_Buffet.jpg">โหลดสลิป</a></Button></div>
                        <div className={styles.slipbtn}>
                            <label htmlFor="file-input" className={`${styles.file_input} ${buffetSelcted?.paymentStatus === buffetPaymentStatusEnum.CHECKING ? styles.disabled : ''}`} >
                                เลือกภาพสลิป
                            </label>
                            <input
                                style={{ display: 'none' }}
                                disabled={buffetSelcted?.paymentStatus == buffetPaymentStatusEnum.CHECKING || buffetSelcted?.paymentStatus == buffetPaymentStatusEnum.PAID}
                                id="file-input"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className={`file-input ${buffetSelcted?.paymentStatus == buffetPaymentStatusEnum.CHECKING || buffetSelcted?.paymentStatus == buffetPaymentStatusEnum.PAID ? styles.disabled : ''}`}
                            />
                            <button
                                onClick={confirm}
                                disabled={!selectedFile || buffetSelcted?.paymentStatus != buffetPaymentStatusEnum.PENDING && buffetSelcted?.paymentStatus != buffetPaymentStatusEnum.REJECT}
                                className={`${styles.slip} ${selectedFile ? '' : styles.disabled} `}

                            >
                                {buffetSelcted?.paymentStatus == buffetPaymentStatusEnum.CHECKING ? 'ส่งสลิปแล้ว' : 'ส่งสลิป'}
                            </button>
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>

            <SaleDetailModal 
            show={showSaleDetailModal} 
            onHide={handleCloseDetailModal} 
            isSalesDataLoading={isSalesDataLoading} 
            salesData={salesData} 
            />
            
      
        </>

    );
};

export default Infobuffet;
