import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Flex } from '@chakra-ui/react';
import Swal from 'sweetalert2';
// import ColumsLeft from './columsLeft'
// import ColumsRight from './columsRight'
import Head from 'next/head';

interface ItemsType {
    [key: string]: string[];
}
const initialLeftItems: ItemsType = {
    T0: [],
    T1: [],
    T2: [],
    T3: [],
    T4: [],
    T5: [],
    T6: [],
    T7: [],
    T8: [],
    T9: [],
}

const initialRightItems = {
    tasks: [],
}
interface Buffet {
    id: number;
    nickname: string;
    usedate: string;
    phone: string;
    price: number;
    shuttle_cock: number;
    q_id: number;
    q_list: number;
    paymentStatus: number;
    paymentSlip: string;
    regisDate: string;
    T_value: string;
    shuttle_cock_price: number;
}

function Buffets() {
    // const ColumsLeft = dynamic(() => import("./columsLeft"), { ssr: false });
    // const ColumsRight = dynamic(() => import("./columsRight"), { ssr: false });

    const ColumsLeft = ({ tasks, index, isMobile }: any) => {
        return (
            <div style={{ width: '100%' }}>
                <Droppable droppableId={`left-${index}`} direction="horizontal">
                    {(droppableProvided) => (
                        <Flex
                            maxWidth={"100%"}
                            height={'100%'}
                            {...droppableProvided.droppableProps}
                            ref={droppableProvided.innerRef}
                        >

                            {tasks.map((task: any, index: number) => (
                                <>
                                    <Draggable
                                        key={task.id}
                                        draggableId={task.id.toString()}
                                        index={index}
                                    >
                                        {(draggableProvided, draggableSnapshot) => (
                                            <Flex
                                                m={"0.2rem"}
                                                p={"0"}
                                                width={'150px'}
                                                maxWidth={"100%"}
                                                bg={draggableSnapshot.isDragging ? "lightblue" : "white"}
                                                rounded="3px"
                                                height={'32px'}
                                                textAlign="center"
                                                _active={{ bg: "white" }}
                                                outline="0px solid transparent"
                                                outlineColor={
                                                    draggableSnapshot.isDragging ? "blue" : ""
                                                }
                                                boxShadow={
                                                    draggableSnapshot.isDragging
                                                        ? "0 5px 10px rgba(0, 0, 0, 0.6)"
                                                        : "unset"
                                                }
                                                align="center"
                                                flexDirection={"column"}
                                                zIndex={1}
                                                {...draggableProvided.dragHandleProps}
                                                {...draggableProvided.draggableProps}
                                                ref={draggableProvided.innerRef}
                                            >
                                                <span className="p-1 " style={{ fontSize: `${isMobile ? '' : '12px'}` }}>{isMobile ? task.content : task.nickname}</span>
                                            </Flex>
                                        )}
                                    </Draggable>
                                    {index === 1 && (
                                        <Flex
                                            m={"0.2rem"}
                                            p={"0"}
                                            width={"50px"}
                                            height={'32px'}

                                            rounded="3px"
                                            textAlign="center"
                                            _active={{ bg: "white" }}
                                            outline="0px solid transparent"

                                            align="center"
                                            flexDirection={"column"}
                                            zIndex={1}
                                        >
                                            <span className="p-1 fs-6 text-white fw-bold">VS</span>
                                        </Flex>
                                    )}
                                </>
                            ))}
                            {droppableProvided.placeholder}

                        </Flex>

                    )}
                </Droppable>

            </div>

        );
    };
    const ColumsRight = ({ tasks }: any) => {
        return (
            <div style={{ width: '100%' }}>
                <Droppable droppableId={`right`} direction="horizontal" >
                    {(droppableProvided) => (
                        <Flex
                            maxWidth={"100%"}
                            height={'100%'}
                            bg={'#0087FF'}
                            p={"10px"}
                            rounded={"5px"}
                            {...droppableProvided.droppableProps}
                            ref={droppableProvided.innerRef}
                            css={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(150px , 1fr))",
                                gap: "0.1rem",
                            }}
                        >
                            {tasks.map((task: any, index: any) => (
                                <Draggable
                                    key={task.id}
                                    draggableId={task.id.toString()}
                                    index={index}
                                >
                                    {(draggableProvided, draggableSnapshot) => (
                                        <Flex
                                            m={"0.2rem"}
                                            p={"0"}
                                            bg={draggableSnapshot.isDragging ? "lightblue" : "white"}
                                            rounded="3px"
                                            textAlign="center"
                                            _active={{ bg: "white" }}
                                            outline="0px solid transparent"
                                            outlineColor={
                                                draggableSnapshot.isDragging ? "blue" : ""
                                            }
                                            boxShadow={
                                                draggableSnapshot.isDragging
                                                    ? "0 5px 10px rgba(0, 0, 0, 0.6)"
                                                    : "unset"
                                            }
                                            align="center"
                                            flexDirection={"column"}
                                            zIndex={1}
                                            {...draggableProvided.dragHandleProps}
                                            {...draggableProvided.draggableProps}
                                            ref={draggableProvided.innerRef}
                                        >
                                            <span className="p-1 fs-6">{task.content}</span>
                                        </Flex>
                                    )}
                                </Draggable>
                            ))}
                            {droppableProvided.placeholder}

                        </Flex>
                    )}
                </Droppable>
            </div>
        );
    };
    const [data, setData] = useState<Buffet[]>([]);
    const [selectDataPayment, setSelectDataPayment] = useState<Buffet | null>();
    const [leftItems, setLeftItems] = useState<ItemsType>(initialLeftItems);
    const [rightItems, setRightItems] = useState<any>(initialRightItems);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [show, setShow] = useState(false);

    const [shuttle_cock_price, setShuttle_cock_price] = useState(0);
    const [total_shuttle_cock_price, setTotal_shuttle_cock_price] = useState(0);

    const elements = [];
    const numberOfProperties = Object.keys(leftItems).length;
    useEffect(() => {
        fetchRegis();
        setIsMobile(window.innerWidth > 768);
        getSelectedOptions()
    }, [])
    const getSelectedOptions = async () => {
        try {
            const response = await fetch('/api/admin/buffet/save-selected-options');
            if (response.ok) {
                const data = await response.json();
                setSelectedOptions(data[0].selected_options)
            } else {
                console.error('Failed to fetch selected options.');
            }
        } catch (error) {
            console.error('Error occurred while fetching selected options:', error);
        }
    };
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    const fetchRegis = async () => {
        try {
            setLeftItems(initialLeftItems)
            setRightItems(initialRightItems)
            const response = await fetch(`/api/admin/buffet/getRegis`)
            if (response.ok) {
                const data = await response.json();
                setData(data);
                setShuttle_cock_price(data[0].shuttle_cock_price)
                const newRightItems = { ...rightItems };
                const notQdata = data.filter((item: Buffet) => item.q_id === null);
                const newTasks = notQdata.map((item: Buffet, index: number) => ({
                    id: item.id,
                    content: `${item.nickname}`,
                    nickname: `${item.nickname}`,
                    q_list: item.q_list || index + 999,
                }));
                newTasks.sort((a: Buffet, b: Buffet) => a.q_list - b.q_list);
                newRightItems['tasks'] = newTasks;
                setRightItems(newRightItems);
                const newLeftItems = { ...leftItems };
                for (let i = 0; i < numberOfProperties; i++) {
                    const colname = `T${i}`;
                    // กรองข้อมูลที่มี q_id เท่ากับ i
                    const QData = data.filter((item: Buffet) => item.q_id !== null && item.q_id === i);
                    // แปลงข้อมูลที่ผ่านการกรองเป็นรูปแบบที่ต้องการ
                    const newTasksLeft = QData.map((item: Buffet) => ({
                        id: item.id,
                        content: `${item.nickname}`,
                        nickname: `${item.nickname}`,
                        q_list: item.q_list || 0,
                    }));
                    newTasksLeft.sort((a: Buffet, b: Buffet) => a.q_list - b.q_list);
                    newLeftItems[colname] = newTasksLeft;
                }
                setLeftItems(newLeftItems);
                Toast.fire({
                    icon: 'success',
                    title: 'Updated'
                })
            } else {
                Toast.fire({
                    icon: 'error',
                    title: 'error'
                })
            }
        } catch (error) {
            console.error(error)
        }
    }
    const [selectedOptions, setSelectedOptions] = useState(Array(numberOfProperties).fill(''));
    const handleSelectChange = async (index: number, event: any) => {
        const options = [...selectedOptions]; // ค่าเดิม array ของ selectedOptions
        options[index] = event.target.value; // อัปเดตค่าใน index ที่ระบุ
        setSelectedOptions(options); // อัปเดตสถานะ selectedOptions
        // upload ไปที่ database
        updateCurrent_cock(options)
    };
    const updateCurrent_cock = async (options: any) => {
        try {
            const response = await fetch('/api/admin/buffet/save-selected-options', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ options }),
            });

            if (response.ok) {
                console.log('Selected options saved successfully!');
            } else {
                console.error('Failed to save selected options.');
            }
        } catch (error) {
            console.error('Error occurred while saving selected options:', error);
        }
    }
    for (let i = 0; i < numberOfProperties; i++) {
        const entries = Object.entries(leftItems)
        elements.push(
            <div>
                <div key={i} className='d-flex flex-row mb-1 p-1 justify-content-between' style={{ backgroundColor: '#7A7AF9', borderRadius: '8px', height: '45px' }}>
                    <Flex
                        m={"0.2rem"}
                        p={"0"}
                        width={"40px"}
                        rounded="3px"
                        textAlign="center"
                        outline="0px solid transparent"
                        bg={'#FFED00'}
                        align="center"
                        flexDirection={"column"}
                        zIndex={1}
                    >
                        <span className="p-1 fs-6 text-black "  >{i + 1}</span>
                    </Flex>
                    <ColumsLeft tasks={entries[i][1]} index={i} isMobile={isMobile} />
                    <select key={i + 1} className="form-control mx-1" id={`exampleFormControlSelect1-${i}`} style={{ width: '40PX' }} value={selectedOptions[i]} onChange={(event) => handleSelectChange(i, event)}>
                        <option>0</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                    </select>

                    <Button className='btn btn-warning ' style={{ fontSize: `${isMobile ? '' : '12px'}`, display: 'flex', justifyContent: 'end' }} onClick={() => clearArray(entries[i][1], i)} >{!isMobile ? 'C' : 'Clear'}</Button>
                    <select key={i + 2} className="form-control mx-1" id="exampleFormControlSelect1" style={{ width: '40PX' }}>
                        <option>-</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                    </select>

                </div>
            </div>
        );
    }
    const clearArray = async (value: any, index: number) => {

        const updatedLeftItems: Record<string, any> = { ...leftItems };
        const updatedOptions=  [...selectedOptions ];

        for (let i = index; i < numberOfProperties - 1; i++) {
            const currentColName = `T${i}`;
            const nextColName = `T${i + 1}`;
            updatedOptions[i] = [selectedOptions[i+1]];
            // Copy data from the next column to the current column
            updatedLeftItems[currentColName] = [...leftItems[nextColName]];

            // Clear the next column
            updatedLeftItems[nextColName] = [];
        }
        
        setLeftItems(updatedLeftItems);



        const right: any = value
        for (let i = 0; i < right.length; i++) {
            right[i].q_list = i + 1
        }
        const newState: any = {
            ...rightItems,
            tasks: [...rightItems.tasks, ...right],
        };
        setRightItems(newState);
        for (let i = 0; i < 2; i++) {
            let url = '';
            let data;

            if (i === 0) {
                url = `/api/admin/buffet/updateQ_clear`
                data = updatedLeftItems;
            } else if (i === 1) {
                url = `/api/admin/buffet/updateQ?q_id=${null}&shuttle_cock=${selectedOptions[index]}`
                data = right
            }

            try {
                const response = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    Toast.fire({
                        icon: 'error',
                        title: 'error'
                    })
                    throw new Error('ไม่สามารถดึงข้อมูลได้');
                } else {
                    Toast.fire({
                        icon: 'success',
                        title: 'Updated '
                    })
                    setSelectedOptions(updatedOptions); // อัปเดตสถานะ selectedOptions
                    updateCurrent_cock(updatedOptions)
                    fetchRegis();
                }
            } catch (err) {
                console.error(err)
            }
        }

    };

    const onDragEnd = async (result: any) => {
        if (!result.destination) return;

        const { source, destination } = result;

        if (source.droppableId === destination.droppableId) {
            if (source.droppableId.startsWith('left')) {
                for (let i = 0; i < numberOfProperties; i++) {
                    if (source.droppableId === `left-${i}`) {
                        const colName = `T${i}`;
                        const entries = Object.entries(leftItems);
                        const reorderedItems = Array.from(entries[i][1]);
                        const [removedItem] = reorderedItems.splice(source.index, 1);
                        reorderedItems.splice(destination.index, 0, removedItem);
                        const newState: any = {
                            ...leftItems,
                            [colName]: reorderedItems,
                        };
                        for (let i = 0; i < reorderedItems.length; i++) {
                            newState[colName][i].q_list = i + 1
                        }
                        setLeftItems(newState);
                        try {
                            const response = await fetch(`/api/admin/buffet/updateQ?q_id=${i}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(reorderedItems),
                            });

                            if (!response.ok) {
                                Toast.fire({
                                    icon: 'error',
                                    title: 'error'
                                })
                                throw new Error('ไม่สามารถดึงข้อมูลได้');
                            } else {
                                Toast.fire({
                                    icon: 'success',
                                    title: 'Updated'
                                })
                            }
                        } catch (err) {
                            console.error(err)
                        }
                    }
                    break;
                }
            } else {
                const reorderedItems = Array.from(rightItems.tasks);
                const [removedItem] = reorderedItems.splice(source.index, 1);
                reorderedItems.splice(destination.index, 0, removedItem);

                const right: any = reorderedItems
                for (let i = 0; i < reorderedItems.length; i++) {
                    right[i].q_list = i + 1
                }
                const newState: any = {
                    tasks: right,
                };
                setRightItems(newState);
                try {
                    const response = await fetch(`/api/admin/buffet/updateQ?q_id=${null}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(reorderedItems),
                    });

                    if (!response.ok) {
                        Toast.fire({
                            icon: 'error',
                            title: 'error'
                        })
                        throw new Error('ไม่สามารถดึงข้อมูลได้');
                    } else {
                        Toast.fire({
                            icon: 'success',
                            title: 'Updated'
                        })
                    }
                } catch (err) {
                    console.error(err)
                }
            }

        } else {

            let sourceItems = [];
            let destinationItems = [];
            let droppableId = null
            if (destination > 4) {
                return;
            }
            for (let i = 0; i < numberOfProperties; i++) {
                if (source.droppableId === 'right') {
                    sourceItems = rightItems.tasks;
                } else if (source.droppableId === `left-${i}`) {
                    sourceItems = Object.entries(leftItems)[i][1];
                }

                if (destination.droppableId === 'right') {
                    destinationItems = rightItems.tasks;
                    droppableId = null
                } else if (destination.droppableId === `left-${i}`) {
                    destinationItems = Object.entries(leftItems)[i][1];
                    droppableId = i

                }
            }
            if (destinationItems.length < 4 || destination.droppableId === 'right') {
                const [movedItem] = sourceItems.splice(source.index, 1);
                destinationItems.splice(destination.index, 0, movedItem);
                for (let i = 0; i < destinationItems.length; i++) {
                    destinationItems[i].q_list = i + 1
                }
                try {
                    const response = await fetch(`/api/admin/buffet/updateQ?q_id=${droppableId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(destinationItems),
                    });

                    if (!response.ok) {
                        Toast.fire({
                            icon: 'error',
                            title: 'error'
                        })
                        throw new Error('ไม่สามารถดึงข้อมูลได้');
                    } else {
                        Toast.fire({
                            icon: 'success',
                            title: 'Updated'
                        })
                    }
                } catch (err) {
                    console.error(err)
                }
            }
        }
    };
    const add_reduce = async (id: number, shuttle_cock: number) => {
        try {
            const response = await fetch('/api/admin/buffet/add_reduce', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, shuttle_cock })
            });

            if (!response.ok) {
                throw new Error('Failed to update data');
            }
            fetchRegis();
        } catch (error) {
            console.error('Error updating data:', error);
        }
    }

    const payMethod = async (id: any, method: string) => {
        Swal.fire({
            title: `รับชำระด้วย ${method}?`,
            text: `ลูกค้าชำระค่าลูกแบดด้วย ${method} ทั้งหมด ${total_shuttle_cock_price} บาท`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm "
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    method = method + total_shuttle_cock_price + 'บาท'
                    const response = await fetch('/api/admin/buffet/pay_shuttle_cock', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id, method })
                    });

                    if (!response.ok) {
                        throw new Error('Failed to update data');
                    }
                    fetchRegis();
                    setShow(false);
                    Swal.fire({
                        title: "บันทึกสำเร็จ!",
                        icon: "success"
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


    return (
        <>
            <Head>
                <title>Buffet Queue Set</title>
            </Head>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className='container-fluid text-center' style={{ overflow: 'hidden' }}>
                    <div className="d-flex justify-content-between mb-1">
                        <div></div>
                        <h4>จัดคิวตีบุฟเฟ่ต์</h4>
                        <Button className='btn btn-sm' onClick={fetchRegis}>refresh</Button>
                    </div>

                    <div className='row'>
                        <div className='col me-3 p-2' style={{ border: "1px solid #5757FF", backgroundColor: "#CCE5F3", borderRadius: '10px' }}>
                            <h6 className='fw-bold bg-primary text-white rounded p-1' >คิวการเล่น</h6>
                            {elements}
                        </div>
                        <div className='col p-2' style={{ border: "1px solid #5757FF", backgroundColor: "#CCE5F3", borderRadius: '10px' }}>
                            <h6 className='fw-bold bg-primary text-white rounded p-1' >ผู้จองตีบุฟเฟต์วันนี้ </h6>
                            {rightItems.tasks.length === 0 && (
                                <div style={{ color: 'red', fontWeight: 'bold' }}>ไม่พบข้อมูล</div>
                            )}
                            <div className='row'>
                                <div className='col' style={{ width: '650px' }}><ColumsRight tasks={rightItems.tasks} /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </DragDropContext>
            <div className='mt-2 p-2' style={{ width: '100%', border: "1px solid #5757FF", backgroundColor: "#7A7AF9", borderRadius: '10px', height: 'auto', display: 'flex', gap: "0.1rem", flexDirection: 'row', flexWrap: 'wrap' }}>
                {data.map((item, index) => (
                    <Flex
                        key={index}
                        m={"0.1rem"}
                        maxWidth={"400px"}
                        rounded="8px"
                        textAlign="center"
                        outline="0px solid transparent"
                        bg={'#FFFFFF'}
                        align="center"
                        flexDirection={"column"}
                        zIndex={1}
                    >
                        <span className="fs-6 text-black" style={{ padding: '3px' }}>
                            <span className='mx-3'><Button className='btn btn-sm btn-light' onClick={() => { setShow(true); setSelectDataPayment(item); setTotal_shuttle_cock_price((item?.shuttle_cock_price / 4) * item?.shuttle_cock) }} >{`${item.nickname}`}</Button></span>
                            <Button className='btn-sm btn me-1 btn-danger px-2' onClick={() => { add_reduce(item.id, item.shuttle_cock - 1) }} disabled={item.shuttle_cock == 0}>-</Button>
                            <span className='mx-2'>{item.shuttle_cock}</span>
                            <Button className='btn btn-sm me-1 px-2' onClick={() => { add_reduce(item.id, item.shuttle_cock + 1) }}>+</Button>
                        </span>
                    </Flex>
                ))
                }
            </div>

            <Modal show={show} onHide={() => setShow(false)} centered >
                <Modal.Header closeButton>
                    <Modal.Title>ชำระค่าลูกแบด</Modal.Title>
                </Modal.Header>
                <Modal.Body className='w-75 m-auto'>
                    <div className='detail'>
                        <div className='d-flex justify-content-between'>
                            <p>ชื่อลูกค้า</p>
                            <p>{selectDataPayment?.nickname}</p>
                        </div>
                        <div className='d-flex justify-content-between'>
                            <p>จำนวนลูก</p>
                            <p>{selectDataPayment?.shuttle_cock} ลูก</p>
                        </div>
                        <div className='d-flex justify-content-between'>
                            <p>ค่าลูก</p>
                            <p>{selectDataPayment?.shuttle_cock_price} บาท / ลูก</p>
                        </div>
                        <div className='d-flex justify-content-between'>
                            <p>ราคาหาร 4</p>
                            <p>{`${shuttle_cock_price / 4} บาท/คน/ลูก`}</p>
                        </div>

                        <div className='d-flex justify-content-between'>
                            <p>จำนวนที่ต้องชำระ</p>
                            <p> {`${selectDataPayment?.shuttle_cock} * ${shuttle_cock_price / 4} = `} <span className='fw-bold fs-5 text-danger'>{total_shuttle_cock_price}</span> บาท</p>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className='d-flex justify-content-between'>
                    <div>วิธีชำระเงิน</div>
                    <div>
                        <Button className='mx-2  btn btn-success' onClick={() => payMethod(selectDataPayment?.id, "เงินสด")} >ผ่านเงินสด</Button>
                        <Button onClick={() => payMethod(selectDataPayment?.id, "โอนเงิน")} >ผ่านการโอน</Button>
                    </div>
                </Modal.Footer>
            </Modal>

        </>

    )
}

export default Buffets;