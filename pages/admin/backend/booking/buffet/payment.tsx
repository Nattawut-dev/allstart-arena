import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap';

function Payment({ modalShow }: any) {
    const [show, setShow] = useState<boolean>(modalShow);
    const [show2, setShow2] = useState(false);
    useEffect(() => {
        setShow(modalShow); // Update the state when modalShow prop changes
    }, [modalShow]);
    return (
        <>
            <Modal show={show} onHide={() => setShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>ชำระค่าลูกแบด</Modal.Title>
                </Modal.Header>
                <Modal.Body className='w-75 m-auto'>
                    <div className='detail'>
                        <div className='d-flex justify-content-between'>
                            <p>ชื่อลูกค้า</p>
                            <p>ชื่อ</p>
                        </div>
                        <div className='d-flex justify-content-between'>
                            <p>จำนวนลูก</p>
                            <p>10</p>
                        </div>
                        <div className='d-flex justify-content-between'>
                            <p>ราคาต่อลูก</p>
                            <p>   {`25 บาท/คน/ลูก`}</p>
                        </div>
                        <div className='d-flex justify-content-between'>
                            <p>จำนวนที่ต้องชำระ</p>
                            <p> {`10 * 25 = 250`} บาท</p>
                        </div>

                    </div>

                </Modal.Body>
                <Modal.Footer className='d-flex justify-content-between'>
                    <div>วิธีชำระเงิน</div>
                    <div>
                        <Button className='mx-2  btn btn-success' >ผ่านเงินสด</Button>
                        <Button>ผ่านการโอน</Button>
                    </div>
                </Modal.Footer>
            </Modal>
            <Modal show={show2} onHide={() => setShow2(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>วิธีชำระเงิน</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Payment