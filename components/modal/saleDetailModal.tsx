import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { ISales } from '@/interface/sales';
import { paymentStatusEnum } from '@/enum/paymentStatusEnum';
import { renderPaymentType } from '@/lib/renderPaymentType';

interface SaleDetailModalProps {
    show: boolean;
    onHide: () => void;
    isSalesDataLoading: boolean;
    salesData: Array<ISales>; 
}

const SaleDetailModal: React.FC<SaleDetailModalProps> = ({ show, onHide, isSalesDataLoading, salesData }) => {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>รายละเอียดการซื้อ</Modal.Title>
            </Modal.Header>
            <Modal.Body className='p-2 mt-2'>
                {isSalesDataLoading ? (
                    <div className='d-flex justify-content-center'>
                        <Spinner animation="border" role="status" />
                    </div>
                ) : (
                    <>
                        {salesData.length > 0 ? (
                            <div className='flex-row w-100 d-flex'>
                                <div className='d-flex align-items-center flex-column' style={{ overflowY: 'auto', height: '80vh', overflowX: 'hidden', width: '600px' }}>
                                    {salesData.map((saleData) => (
                                        <div key={saleData?.BillNumber} className='border mt-2 p-4 mb-5 rounded' style={{ width: '450px' }}>
                                            <div>
                                                <div className='d-flex justify-content-end'>
                                                    {saleData?.flag_delete === 1 ? (
                                                        <div className='text-danger' style={{ fontSize: '16px' }}>*ลบเเล้ว</div>
                                                    ) : (
                                                        <>
                                                            {saleData?.PaymentStatus === paymentStatusEnum.Paid && (
                                                                <div className='text-success' style={{ fontSize: '16px' }}>ชำระเรียบร้อย</div>
                                                            )}
                                                            {saleData?.PaymentStatus === paymentStatusEnum.PENDING && (
                                                                <div className='text-danger' style={{ fontSize: '16px' }}>รอชำระ</div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                                <div className='d-flex justify-content-center'>
                                                    <div>
                                                        <div className='fw-bold fs-3'>{(Number(saleData?.TotalAmount) ?? 0).toFixed(2)} บาท</div>
                                                        <div className='text-center'>รวมทั้งหมด</div>
                                                    </div>
                                                </div>
                                                <hr />
                                                <div className='ms-3'>
                                                    <div className='d-flex align-items-center justify-content-between text-start'>
                                                        <div className='d-flex flex-row align-items-center'>
                                                            <span className='fw-bold' style={{ fontSize: '16px' }}>ชำระเงิน</span>
                                                            <span className='fw-bold' style={{ fontSize: '16px' }}>:</span>
                                                            <span className='fw-bold' style={{ fontSize: '16px' }}>
                                                                {renderPaymentType(saleData?.PaymentType)}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <div className='d-flex justify-content-end me-3' style={{ fontSize: '16px' }}>#{saleData?.BillNumber}</div>
                                                        </div>
                                                    </div>
                                                    <div className='d-flex'>
                                                        <div className='text-secondary align-item-center' style={{ fontSize: '13px' }}>
                                                            {new Date(saleData?.SaleDate ?? '').toLocaleString('th-TH')}
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr />
                                                <div>
                                                    {saleData.saleDetails && saleData.saleDetails.map((detail) => (
                                                        <div key={detail.SaleDetailID} className='ms-3 mt-2'>
                                                            <div className='d-flex justify-content-between'>
                                                                <div className='d-flex'>{detail.ProductName}</div>
                                                                <div className='d-flex justify-content-end me-3'>{Number(detail.TotalSales ?? 0).toFixed(2)}</div>
                                                            </div>
                                                            <div className='d-flex'>
                                                                <div className='ms-1' style={{ fontSize: '12px' }}>{detail.Quantity}</div>
                                                                <div className='ms-1' style={{ fontSize: '12px' }}>x</div>
                                                                <div className='ms-1' style={{ fontSize: '12px' }}>{Number(detail.productPrice ?? 0).toFixed(2)}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div>
                                                    <div className='d-flex mt-5 mx-3'>
                                                        <div className=''>ทั้งหมด</div>
                                                        <div className='ms-1'>{saleData.saleDetails!.reduce((total, item) => total + item.Quantity, 0) ?? 0}</div>
                                                        <div className='ms-2'>รายการ</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className='d-flex justify-content-center'>no data</div>
                        )}
                    </>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default SaleDetailModal;
