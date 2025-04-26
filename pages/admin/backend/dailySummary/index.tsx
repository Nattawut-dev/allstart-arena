import { useState, useEffect, ChangeEvent } from 'react';
import Head from 'next/head';
import { Modal } from 'react-bootstrap';
import ListNotPayBuffetNewbie from './ListNotPayBuffetNewbie'

interface SumData {
    pay_date: string;
    sum_reserve: number;
    sum_tournament: number;
    sum_buffet: number;
    sum_buffet_cash: number;
    sum_buffet_tranfer: number;
    sum_buffet_notPay: number;
    sum_buffet_newbie: number;
    sum_buffet_newbie_cash: number;
    sum_buffet_newbie_tranfer: number;
    sum_buffet_newbie_notPay: number;
    total_sum: number;
}

export default function DailySum() {
    const [selectedValue, setSelectedValue] = useState(10);
    const [sumdata, setSumdata] = useState<SumData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [showNewbie, setShowNewbie] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');

    useEffect(() => {
        fetchData(selectedValue);
    }, [selectedValue]);

    const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedValue(parseInt(event.target.value));
    };

    const fetchData = async (selectedValue: number) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/dailySum?selectedValue=${selectedValue}`);
            if (res.ok) {
                const data = await res.json();
                setSumdata(data);
            } else {
                setSumdata([]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setSumdata([]);
        } finally {
            setIsLoading(false);
        }
    };

    const renderTableRows = (data: SumData[]) => {
        return data.map((item, index) => {
            const buffetSum = Math.ceil(item.sum_buffet_cash + item.sum_buffet_tranfer) || 0;
            const buffetNewbieSum = Math.ceil(item.sum_buffet_newbie_cash + item.sum_buffet_newbie_tranfer) || 0;

            return (
                <>
                    {/* Row 1 */}
                    <tr key={`${index}-cash`}>
                        <td rowSpan={4}>{item.pay_date}</td>
                        <td rowSpan={4}>{item.sum_reserve}</td>
                        <td rowSpan={4}>{item.sum_tournament}</td>

                        <td>เงินสด</td>
                        <td className="table-primary">{item.sum_buffet_cash}</td>
                        <td rowSpan={4} className="table-info">{buffetSum}</td>

                        <td>เงินสด</td>
                        <td className="table-primary">{item.sum_buffet_newbie_cash}</td>
                        <td rowSpan={4} className="table-info">{buffetNewbieSum}</td>

                        <td rowSpan={4}>{item.total_sum}</td>
                    </tr>

                    {/* Row 2 */}
                    <tr key={`${index}-transfer`}>
                        <td>เงินโอน</td>
                        <td className="table-success">{item.sum_buffet_tranfer}</td>

                        <td>เงินโอน</td>
                        <td className="table-success">{item.sum_buffet_newbie_tranfer}</td>
                    </tr>

                    {/* Row 3 */}
                    <tr key={`${index}-notpay`}>
                        <td>ยังไม่จ่าย</td>
                        <td className="table-danger">
                            <button
                                onClick={() => { setShow(true); setSelectedDate(item.pay_date); }}
                                style={{ border: 'none', background: 'none', textDecoration: 'underline', color: 'red' }}
                            >
                                {item.sum_buffet_notPay} คน
                            </button>
                        </td>

                        <td>ยังไม่จ่าย</td>
                        <td className="table-danger">
                            <button
                                onClick={() => { setShowNewbie(true); setSelectedDate(item.pay_date); }}
                                style={{ border: 'none', background: 'none', textDecoration: 'underline', color: 'red' }}
                            >
                                {item.sum_buffet_newbie_notPay} คน
                            </button>
                        </td>
                    </tr>

                    {/* Row 4 */}
                    <tr key={`${index}-spacer`}></tr>
                </>
            );
        });
    };

    const SkeletonTable = () => (
        <>
            {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                    {Array.from({ length: 10 }).map((_, colIndex) => (
                        <td key={colIndex}>
                            <div className="skeleton-line" style={{ height: '80px' }}></div>
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );

    return (
        <>
            <Head>
                <title>สรุปยอดรายวัน</title>
            </Head>
            <div className='w-75 m-auto'>
                <div className='d-flex justify-content-between'>
                    <h4>สรุปยอดรายวัน</h4>
                    <div className='d-flex'>
                        <div className="input-group text-center">
                            <h4>ย้อนหลัง</h4>
                            <select
                                className="custom-select mx-2"
                                style={{ borderRadius: '5px' }}
                                value={selectedValue}
                                onChange={handleSelectChange}
                            >
                                {[5, 10, 20, 30, 40, 50, 60, 70, 80].map((day) => (
                                    <option key={day} value={day}>{day} วัน</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <p className='text-danger'>คำแนะนำ : วันที่ไม่แสดงคือไม่มีการชำระเงินเข้ามาในวันนั้นๆ</p>
                <table className="table table-bordered text-center align-middle table-sm border-dark fw-bold mt-3">
                    <thead>
                        <tr>
                            <th>วันที่</th>
                            <th>ค่าจองสนาม</th>
                            <th>ค่าสมัครแข่งขัน</th>
                            <th colSpan={2}>ตีบุฟเฟต์</th>
                            <th>รวมบุฟเฟต์</th>
                            <th colSpan={2}>ตีบุฟเฟต์มือใหม่</th>
                            <th>รวมมือใหม่</th>
                            <th>รวมทั้งหมด</th>
                        </tr>
                    </thead>

                    <tbody>
                        {isLoading ? <SkeletonTable /> : renderTableRows(sumdata)}
                    </tbody>
                </table>
            </div>

            {/* Modal มือปกติ */}
            <Modal show={show} onHide={() => { setShow(false); fetchData(selectedValue) }} centered fullscreen>
                <Modal.Header closeButton>
                    <Modal.Title>รายละเอียดบุฟเฟต์ (ปกติ)</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListNotPayBuffetNewbie date={selectedDate} mode="normal" />
                </Modal.Body>
            </Modal>

            {/* Modal มือใหม่ */}
            <Modal show={showNewbie} onHide={() => { setShowNewbie(false); fetchData(selectedValue) }} centered fullscreen>
                <Modal.Header closeButton>
                    <Modal.Title>รายละเอียดบุฟเฟต์มือใหม่</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListNotPayBuffetNewbie date={selectedDate} mode="newbie" />
                </Modal.Body>
            </Modal>
        </>
    );
}
