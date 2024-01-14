import { useState, useEffect, ChangeEvent } from 'react';

import Head from 'next/head';
import { Button, Modal } from 'react-bootstrap';
import Booking from './notpay_buffet'
interface sumdata {
    date_selected: string;
    sum_reserve: number;
    sum_tournament: number;
    sum_buffet: number;
    sum_buffet_cash: number;
    sum_buffet_tranfer: number;
    sum_buffet_notPay: number;
    total_sum: number;
}

export default function Welcome() {
    const [selectedValue, setSelectedValue] = useState(10);
    const [sumdata, setSumdata] = useState<sumdata[]>([]);
    const [show, setShow] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');

    const renderTableRows = (data: any) => {
        return data.map((data: sumdata, index: number) => (
            <>
                <tr key={index}>
                    <td rowSpan={3}>{data.date_selected}</td>
                    <td rowSpan={3}>{data.sum_reserve}</td>
                    <td rowSpan={3}>{data.sum_tournament}</td>
                    <td rowSpan={3}>{data.sum_buffet}</td>
                    <td>เงินสด</td>
                    <td className='table-primary'>{data.sum_buffet_cash}</td>
                    <td rowSpan={3}>{data.total_sum}</td>
                </tr>
                <tr key={index + 'a'}>
                    <td>เงินโอน</td>
                    <td className='table-success'>{data.sum_buffet_tranfer}</td>
                </tr>
                <tr key={index + 'b'}>
                    <td>ยังไม่จ่าย</td>
                    <td className='table-danger'><button onClick={() => {setShow(true) ;setSelectedDate(data.date_selected)}} style={{ border: 'none', background: 'none', textDecoration: 'underline', color: 'red' }}>{data.sum_buffet_notPay} คน</button></td>
                </tr>
                <div className='my-2'></div>
            </>
        ));
    };

    useEffect(() => {
        fetchData(selectedValue);
    }, [selectedValue]);

    const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedValue(parseInt(event.target.value));
    };

    const fetchData = async (selectedValue: number) => {
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
        }
    };
    return (
        <>
            <Head>
                <title>สรุปยอดรายวัน</title>
            </Head>
            <div className=' w-75 m-auto'>
                <div className='d-flex justify-content-between'>
                    <h4>สรุปยอดรายวัน</h4>
                    <div className='d-flex '>
                        <div className="input-group text-center">
                            <h4>ย้อนหลัง</h4>
                            <select
                                className="custom-select mx-2"
                                style={{ borderRadius: '5px' }}
                                id="inputGroupSelect04"
                                value={selectedValue}
                                onChange={handleSelectChange}
                            >
                                <option value="5">5 วัน</option>
                                <option value="10">10 วัน</option>
                                <option value="20">20 วัน</option>
                                <option value="30">30 วัน</option>
                                <option value="40">40 วัน</option>
                                <option value="50">50 วัน</option>
                                <option value="60">60 วัน</option>
                                <option value="70">70 วัน</option>
                                <option value="80">80 วัน</option>
                            </select>
                        </div>
                    </div>
                </div>
                <table className="table table-bordered text-center align-middle table-sm  border-dark fw-bold">
                    <thead>
                        <tr>
                            <th scope="col">วันที่</th>
                            <th scope="col">ค่าจองสนาม</th>
                            <th scope="col">ค่าสมัครแข่งขัน</th>
                            <th scope="col" colSpan={3}>ตีบุฟเฟต์</th>
                            <th scope="col">รวม</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderTableRows(sumdata)}
                    </tbody>
                </table>
            </div>
            <Modal show={show} onHide={() => setShow(false)} centered fullscreen>
                <Modal.Header closeButton>
                    <Modal.Title>Detail</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Booking date={selectedDate}/>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>

        </>
    );
}

