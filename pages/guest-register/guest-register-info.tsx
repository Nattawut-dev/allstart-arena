import { Toast } from "@/components/toast";
import { paymentStatusEnum } from "@/enum/paymentStatusEnum";
import { ICustomers } from "@/interface/customers";
import { format } from "date-fns";
import utcToZonedTime from "date-fns-tz/utcToZonedTime";
import { useEffect, useState } from "react";
import { Button, Modal, Spinner, Table } from "react-bootstrap";
import styles from './guest-register.module.css'
import Swal from "sweetalert2";
import Image from 'next/image';
import { customerPaymentStatusEnum } from "@/enum/customerPaymentStatusEnum";
import { ISales } from "@/interface/sales";
import { buffetStatusEnum } from "@/enum/buffetStatusEnum";
import { PaymentTypeEnum } from "@/enum/stateCashierEnum";
import SaleDetailModal from "@/components/modal/saleDetailModal";

function Infobuffet() {
    const dateInBangkok = utcToZonedTime(new Date(), "Asia/Bangkok");
    const [isCustomerLoading, setIsCustomerLoading] = useState(false);
    const [customerData, setCustomerData] = useState<ICustomers[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imgUrl, setImgUrl] = useState('')
    const [customerDetails, setCustomerDetails] = useState<ICustomers | null>(null)
    const [salesData, setSalesData] = useState<ISales[]>([]);
    const [isSalesDataLoading, setIsSalesDataLoading] = useState(true);
    const [showSaleDetailModal, setShowSaleDetailModal] = useState(false);

    const getCustomer = async () => {
        try {
            setCustomerData([]);
            setIsCustomerLoading(true);
            const response = await fetch(`/api/customers/get-today`);
            const data = await response.json();

            if (!response.ok) {
                Toast.fire({
                    icon: 'error',
                    title: 'ไม่พบข้อมูล'
                });
                return;
            }
            setCustomerData(data.customers);
        } catch (error) {
            console.error('Error fetching salesDetail:', error);
        } finally {
            setIsCustomerLoading(false);
        }
    };

    useEffect(() => {
        getCustomer();
    }, []);

    const renderPaymentStatus = (customerPaymentStatus?: customerPaymentStatusEnum) => {
        switch (customerPaymentStatus) {
            case customerPaymentStatusEnum.PAID:
                return <span className="bg-success bg-opacity-10 text-success p-2 rounded">ชำระแล้ว</span>;
            case customerPaymentStatusEnum.PENDING:
                return <span className="bg-warning bg-opacity-10 text-warning p-2 rounded">รอชำระ</span>;
            case customerPaymentStatusEnum.CHECKING:
                return <span className="bg-info bg-opacity-10 text-info p-2 rounded">รอตรวจสอบ</span>;
            case customerPaymentStatusEnum.REJECT:
                return <span className="bg-danger bg-opacity-10 text-danger p-2 rounded">ปฏิเสธสลิป</span>;
            default:
                return <span className="bg-secondary bg-opacity-10 text-dark p-2 rounded">ไม่พบข้อมูล</span>;
        }
    };

    const getDetailCustomer = (customerID: number) => {
        setCustomerDetails(null);
        const customerDetail = customerData.find((customer) => customer.customerID === customerID);
        if (customerDetail) {
            setCustomerDetails(customerDetail);
            setShowModal(true);
        }
    };


    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedFile(null);
        setPreviewImage(null);

    }

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

    const getSalesData = async (buffet_id?: number) => {
        if (!buffet_id) return;
        try {
            setSalesData([]);
            setIsSalesDataLoading(true);
            const response = await fetch(`/api/get-by-customer?buffetId=${buffet_id}&buffetStatus=${buffetStatusEnum.CREDIT_USER}`);
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
            setShowModal(false);
            setShowSaleDetailModal(true);
        } catch (error) {
            console.error('Error fetching salesDetail:', error);
        } finally {
            setIsSalesDataLoading(false);

        }
    };

    const renderPaymentType = (paymentType?: PaymentTypeEnum) => {
        switch (paymentType) {
            case PaymentTypeEnum.CASH:
                return 'เงินสด'
            case PaymentTypeEnum.TRANSFER:
                return 'เงินโอน'
            case PaymentTypeEnum.CUSTOMER:
                return 'ลูกค้า'
            default:
                return 'unknow'
        }
    }

    const handleCloseDetailModal = () => {
        setShowSaleDetailModal(false);
        setShowModal(true);
    }

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

    const handleUpload = async () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('id', customerDetails!.customerID.toString());

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
                const response = await fetch('/api/customers/upload-slip', {
                    method: 'PUT',
                    body: formData,
                });


                if (response.ok) {
                    setShowModal(false);

                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'บันทึกสำเร็จ',
                        showConfirmButton: false,
                        timer: 900,
                    }).then(() => {
                        getCustomer()
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

    return (
        <div>
            <h5 className="text-center mt-4">
                <span>รายชื่อลงทะเบียนซื้อของ วันที่ </span>
                <span style={{ color: 'red' }}>{format(dateInBangkok, 'dd MMMM yyyy')}</span>
            </h5>
            <span>ทั้งหมด {customerData.length} รายการ</span>
            <Table striped bordered hover size="sm">
                <thead className="table-primary">
                    <tr>
                        <th>#</th>
                        <th>รหัสลูกค้า</th>
                        <th>ชื่อเล่น</th>
                        <th>สถานะ</th>
                        <th>ชำระเงิน</th>
                    </tr>
                </thead>
                <tbody>
                    {customerData.length > 0 ? (
                        customerData.map((customer, index) => (
                            <tr key={customer.customerID}>
                                <td>{index + 1}</td>
                                <td>{customer.barcode}</td>
                                <td>{customer.customerName}</td>
                                <td className="p-2">{renderPaymentStatus(customer.customerPaymentStatus)}</td>
                                <td>
                                    <Button className='btn btn-sm' onClick={() => getDetailCustomer(customer.customerID)}>
                                        ชำระเงิน
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-center">ไม่พบข้อมูลลูกค้า</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <Modal centered
                show={showModal}
                onHide={handleCloseModal}
                contentClassName={styles.Modal}
                backdrop="static"
                keyboard={false}
                size='lg'
                dialogClassName={styles.Modal1}
            >
                <Modal.Header closeButton>
                    <Modal.Title>ข้อมูลการลงทะเบียนซื้อของ/ชำระเงิน</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div className={styles.wrapper1}>
                            <div className={styles.img}>
                                <Image src={previewImage ? previewImage : '/QR_Buffet.jpg'} alt="QR_Buffet" width={280} height={280} onClick={() => showSlipImg()} />

                                {customerDetails?.customerPaymentStatus !== null && (
                                    <div style={{ textAlign: "center" }}>
                                        {customerDetails?.customerPaymentStatus === customerPaymentStatusEnum.CHECKING && (
                                            <div><h5> สถานะ  <span style={{ color: 'orange' }}>กำลังตรวจสอบสลิป</span></h5></div>

                                        )}
                                        {customerDetails?.customerPaymentStatus === customerPaymentStatusEnum.PAID && (

                                            <div><h5> สถานะ   <span style={{ color: 'green' }}>ชำระเงินสำเร็จ</span></h5></div>
                                        )}

                                        {customerDetails?.customerPaymentStatus === customerPaymentStatusEnum.REJECT && (

                                            <div><h5> สถานะ   <span style={{ color: 'red' }}>ปฏิเสธสลิป</span></h5></div>
                                        )}

                                        {customerDetails?.customerPaymentStatus === customerPaymentStatusEnum.PENDING && (

                                            <div><h5> สถานะ   <span className="text-warning">รอชำระ</span></h5></div>
                                        )}
                                    </div>

                                )}

                            </div>
                            <div className={styles.detail}>
                                <div className={styles.wrapper}>
                                    <p>ชื่อลูกค้า</p>
                                    <p>{customerDetails?.customerName}</p>
                                </div>
                                <div className={styles.wrapper}>
                                    <p>รหัสลูกค้า</p>
                                    <p>{customerDetails?.barcode}</p>
                                </div>
                                <div className={styles.wrapper}>
                                    <p>สินค้าที่ซื้อ</p>
                                    {customerDetails?.pendingMoney ?
                                        <a className={styles.a} onClick={() => getSalesData(customerDetails?.customerID)}>{customerDetails?.pendingMoney} บาท</a>

                                        :
                                        <p >0 บาท</p>

                                    }
                                </div>

                                <h4 style={{ textAlign: "center" }}>
                                    ทั้งหมด <span style={{ color: 'red' }}>{customerDetails?.pendingMoney ?? 0}</span> บาท
                                </h4>
                                <div className="d-flex flex-column">
                                    <span style={{ color: 'red', textAlign: "center" }}>หากโอนแล้วกรุณาแนบสลิปเมนูข้างล่าง</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className={styles.footer1}>
                        <div className={styles.btn1}><Button className='btn-info '><a href="/QR_Buffet.jpg" download="QR_Buffet.jpg">โหลดสลิป</a></Button></div>
                        <div className={styles.slipbtn}>
                            <label htmlFor="file-input" className={`${styles.file_input} ${customerDetails?.customerPaymentStatus === customerPaymentStatusEnum.PAID ? styles.disabled : ''}`} >
                                เลือกภาพสลิป
                            </label>
                            <input
                                style={{ display: 'none' }}
                                disabled={customerDetails?.customerPaymentStatus === customerPaymentStatusEnum.PAID  || customerDetails?.customerPaymentStatus == customerPaymentStatusEnum.CHECKING}
                                id="file-input"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className={`file-input ${customerDetails?.customerPaymentStatus == customerPaymentStatusEnum.PAID  || customerDetails?.customerPaymentStatus == customerPaymentStatusEnum.CHECKING ? styles.disabled : ''}`}
                            />
                            <button
                                onClick={confirm}
                                disabled={!selectedFile || customerDetails?.customerPaymentStatus == customerPaymentStatusEnum.CHECKING || customerDetails?.customerPaymentStatus === customerPaymentStatusEnum.PAID}
                                className={`${styles.slip} ${!selectedFile || customerDetails?.customerPaymentStatus === customerPaymentStatusEnum.CHECKING || customerDetails?.customerPaymentStatus === customerPaymentStatusEnum.PAID ? styles.disabled: ''} `}

                            >
                                {customerDetails?.customerPaymentStatus == customerPaymentStatusEnum.CHECKING || customerDetails?.customerPaymentStatus === customerPaymentStatusEnum.PAID? 'ส่งสลิปแล้ว' : 'ส่งสลิป'}
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


        </div>
    );
}

export default Infobuffet;
