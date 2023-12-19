import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Flex } from '@chakra-ui/react';
import Swal from 'sweetalert2';
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
    regisDate: string;
    T_value: string;
}


function Buffets() {
    const [data, setData] = useState<Buffet[]>([]);
    const [leftItems, setLeftItems] = useState<ItemsType>(initialLeftItems);
    const [rightItems, setRightItems] = useState<any>(initialRightItems);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    const elements = [];
    const numberOfProperties = Object.keys(leftItems).length;

    const ColumsLeft = ({ tasks, index, isMobile }: any) => {
        return (
            <div style={{ width: '100%' }}>
                <Droppable isDropDisabled droppableId={`left-${index}`} direction="horizontal">
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
        <div style={{width : '100%'}}>
            <Droppable isDropDisabled droppableId={`right`} direction="horizontal" >
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

    const fetchRegis = async () => {
        try {
            const response = await fetch(`/api/buffet/getRegis`)
            if (response.ok) {
                const data = await response.json();
                setData(data);
                const newRightItems = { ...rightItems };
                const notQdata = data.filter((item: Buffet) => item.q_id === null);
                const newTasks = notQdata.map((item: Buffet, index: number) => ({
                    id: item.id,
                    content: `${item.name}(${item.nickname})`,
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
                        content: `${item.name}(${item.nickname})`,
                        nickname: `${item.nickname}`,
                        q_list: item.q_list || 0,
                    }));
                    newTasksLeft.sort((a: Buffet, b: Buffet) => a.q_list - b.q_list);
                    newLeftItems[colname] = newTasksLeft;
                }
                setLeftItems(newLeftItems);
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

    useEffect(() => {
        fetchRegis();
        setIsMobile(window.innerWidth > 768);
        const intervalId = setInterval(() => {
            fetchRegis();
        }, 10000);

        return () => {
            clearInterval(intervalId);
        };
    }, [])

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

 


    for (let i = 0; i < numberOfProperties; i++) {
        const entries = Object.entries(leftItems)
        elements.push(
            <div key={i} className='d-flex flex-row mb-1 p-1 justify-content-end' style={{ backgroundColor: '#7A7AF9', borderRadius: '8px', height: '45px' }}>
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
                    <span className="p-1 fs-6 text-black ">{i + 1}</span>
                </Flex>
                <ColumsLeft tasks={entries[i][1]} index={i} isMobile={isMobile} />
            </div>
        );

    }


    const onDragEnd = async (result: any) => {

    };

    return (
        <>             
        <Head>
            <title>Queue Buffet</title>
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
                                <div className='col' style={{ width: '800px' }}><ColumsRight tasks={rightItems.tasks} /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </DragDropContext>
            <div className='mt-2 p-2' style={{ width: '100%', border: "1px solid #5757FF", backgroundColor: "#CCE5F3", borderRadius: '10px', height: 'auto', display: 'grid', gridTemplateColumns: "repeat(auto-fill, minmax(200px , 1fr))", gap: "0.1rem", }}>
                {data.map((item, index) => (
                    <Flex
                        key={index}
                        m={"0.2rem"}
                        width={"200px"}
                        rounded="3px"
                        textAlign="center"
                        outline="0px solid transparent"
                        bg={'rgb(13,110,253)'}
                        align="center"
                        flexDirection={"column"}
                        zIndex={1}
                    >
                        <span className="fs-6" style={{ padding: '3px', color: '#FFFFFF' }}>
                            <span className='me-1'>{item.name + `(${item.nickname})`}:</span>
                            <span className='me-1' style={{ backgroundColor: 'white', color: 'black', padding: '1px ', borderRadius: '4px' }}> {item.shuttle_cock} ลูก</span>
                        </span>
                    </Flex>
                ))
                }

            </div>
        </>
    )
}

export default Buffets;