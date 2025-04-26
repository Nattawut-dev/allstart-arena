import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Flex } from '@chakra-ui/react';
import Swal from 'sweetalert2';
import Head from 'next/head';
import { IsStudentEnum } from '@/enum/StudentPriceEnum';
import { IQBuffet } from '@/interface/buffet';
import { IHistory, ShuttleCockTypes } from '@/pages/admin/backend/booking/buffet';
import AbbreviatedSelect, { OptionType } from '@/components/admin/AbbreviatedSelect';
import ShuttleCockControl from '@/pages/admin/backend/booking/buffet/ShuttleCockControl';


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
    T10: [],
    T11: [],
    T12: [],
    T13: [],
    T14: [],
    T15: [],
    T16: [],
    T17: [],
    T18: [],
    T19: [],
    T20: [],
    T21: [],
    T22: [],
    T23: [],
    T24: [],
    T25: [],
    T26: [],
    T27: [],
    T28: [],
    T29: [],
}

const initialRightItems = {
    tasks: [],
}

function Buffets() {
    const [data, setData] = useState<IQBuffet[]>([]);
    const [leftItems, setLeftItems] = useState<ItemsType>(initialLeftItems);
    const [rightItems, setRightItems] = useState<any>(initialRightItems);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    const elements = [];
    const numberOfProperties = Object.keys(leftItems).length;
    const [selectedOptions, setSelectedOptions] = useState(Array(numberOfProperties).fill(''));
    const [selectedOptionsCourt, setSelectedOptionsCourt] = useState(Array(numberOfProperties).fill(''));
    const [selectedOptionsShuttleCock, setSelectedOptionsShuttleCock] = useState(Array(numberOfProperties).fill(''));
    const [regisDetail, setRegisDetail] = useState<IQBuffet | null>(null);

    const ColumsLeft = ({ tasks, index, isMobile }: any) => {
        return (
            <div style={{ width: '100%', overflow: 'auto' }} >
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
                                        isDragDisabled
                                    >
                                        {(draggableProvided, draggableSnapshot) => (
                                            <Flex
                                                m={"0.2rem"}
                                                p={"0"}
                                                width={'150px'}
                                                maxWidth={"100%"}
                                                bg={task.isStudent === IsStudentEnum.Student ? "#BEF7C7" : task.isStudent === IsStudentEnum.University ? "#FFD7B5" : draggableSnapshot.isDragging ? "lightblue" : "white"}
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
                                                <span className="p-1 text-center" style={{ fontSize: `${isMobile ? '' : '12px'}` }}>{task.content}</span>
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
                                    isDragDisabled
                                    key={task.id}
                                    draggableId={task.id.toString()}
                                    index={index}
                                >
                                    {(draggableProvided, draggableSnapshot) => (
                                        <Flex
                                            m={"0.2rem"}
                                            p={"0"}
                                            bg={task.isStudent === IsStudentEnum.Student ? "#BEF7C7" : task.isStudent === IsStudentEnum.University ? "#FFD7B5" : draggableSnapshot.isDragging ? "lightblue" : "white"}
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

    const [shuttleCockTypes, setShuttleCockTypes] = useState<OptionType[]>([]);

    const getShuttleCockTypes = async () => {
        try {
            const response = await fetch(`/api/buffet/get_shuttlecock_types`);
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

    const [historys, setHistorys] = useState<IHistory[]>([]);
    const getHistory = async () => {
        try {
            const response = await fetch(`/api/buffet/get_history`, {
                method: 'GET',
            });
            const data = await response.json()

            if (!response.ok) {
                throw new Error('ไม่สามารถดึงข้อมูลได้');
            } else {
                setHistorys(data)
            }
        } catch (err) {
            console.error(err)
        }
    }
    const fetchRegis = async () => {
        getHistory()
        try {
            const response = await fetch(`/api/buffet/getRegis`)
            if (response.ok) {
                const data = await response.json();
                setData(data);
                const newRightItems = { ...rightItems };
                const notQdata = data.filter((item: IQBuffet) => item.q_id === null);
                const newTasks = notQdata.map((item: IQBuffet, index: number) => ({
                    id: item.id,
                    isStudent: item.isStudent,
                    content: `${item.nickname} - ${item.couterPlay} (${item.skillLevel})`,
                    nickname: `${item.nickname}`,
                    q_list: item.q_list || index + 999,
                }));
                newTasks.sort((a: IQBuffet, b: IQBuffet) => a.q_list - b.q_list);
                newRightItems['tasks'] = newTasks;
                setRightItems(newRightItems);
                const newLeftItems = { ...leftItems };
                for (let i = 0; i < numberOfProperties; i++) {
                    const colname = `T${i}`;
                    // กรองข้อมูลที่มี q_id เท่ากับ i
                    const QData = data.filter((item: IQBuffet) => item.q_id !== null && item.q_id === i);
                    // แปลงข้อมูลที่ผ่านการกรองเป็นรูปแบบที่ต้องการ
                    const newTasksLeft = QData.map((item: IQBuffet) => ({
                        id: item.id,
                        isStudent: item.isStudent,
                        content: `${item.nickname} - ${item.couterPlay} (${item.skillLevel})`,
                        nickname: `${item.nickname}`,
                        q_list: item.q_list || 0,
                    }));
                    newTasksLeft.sort((a: IQBuffet, b: IQBuffet) => a.q_list - b.q_list);
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
    const getSelectedOptions = async () => {

        try {
            const response = await fetch(`/api/buffet/save-selected-options`);
            if (response.ok) {
                const data = await response.json();
                setSelectedOptions(data[0].selected_options)
                setSelectedOptionsCourt(data[1].selected_options)
                setSelectedOptionsShuttleCock(data[2].selected_options)
            } else {
                console.error('Failed to fetch selected options.');
            }
        } catch (error) {
            console.error('Error occurred while fetching selected options:', error);
        }
    };
    const getRegisById = async (id: number) => {

        try {
            const response = await fetch(`/api/buffet/get_regis_by_id?id=${id}`);
            if (response.ok) {
                const data = await response.json();
                setRegisDetail(data);
            } else {
                console.error('Failed to fetch shuttlecock types.');
            }
        } catch (error) {
            console.error('Error occurred while fetching shuttlecock types:', error);
        }
    }

    useEffect(() => {
        getShuttleCockTypes();
        fetchRegis();
        getSelectedOptions();
        setIsMobile(window.innerWidth > 768);
        const intervalId = setInterval(() => {
            fetchRegis();
            getSelectedOptions();
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
            <div key={i} className='d-flex flex-row mb-1 p-1 justify-content-end' style={{ backgroundColor: '#7A7AF9', borderRadius: '8px', height: '45px', minWidth: '700px' }}>
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
                <select key={i + 200} className="form-control mx-1" id={`exampleFormControlSelect1-${i}`} disabled style={{ maxWidth: '40px' }} value={selectedOptions[i]} >
                    <option>{selectedOptions[i]}</option>
                </select>
                <AbbreviatedSelect
                    options={shuttleCockTypes}
                    value={selectedOptionsShuttleCock[i]}
                />
                <select key={i + 100} className="form-control mx-1" id={`exampleFormControlSelect1-${i}`} disabled style={{ width: '44px' }} value={selectedOptionsCourt[i]} >
                    <option>{selectedOptionsCourt[i]}</option>
                </select>
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
            <div >
                <DragDropContext onDragEnd={onDragEnd} >
                    <div className='container-fluid text-center' style={{ overflowX: 'hidden' }}>
                        <div className="d-flex justify-content-between mb-1">
                            <div></div>
                            <h4>จัดคิวตีบุฟเฟ่ต์</h4>
                            <Button className='btn btn-sm' onClick={fetchRegis}>refresh</Button>
                        </div>

                        <div className='row gap-1'>
                            <div className='col p-2' style={{ border: "1px solid #5757FF", backgroundColor: "#CCE5F3", borderRadius: '10px', overflowX: 'auto' }}>
                                <h6 className='fw-bold bg-primary text-white rounded p-1' style={{ minWidth: '700px' }} >คิวการเล่น</h6>
                                <div className='d-flex flex-row justify-content-between' style={{ minWidth: '700px' }}>
                                    <span className='mx-3'>คิว</span>
                                    <span>ชื่อผู้เล่น</span>
                                    <div className='d-flex flex-row justify-content-between mx-2' style={{ width: '75px' }}>

                                        <span>ลูก</span>
                                        <span>สนาม</span>

                                    </div>

                                </div>
                                {elements}
                            </div>
                            <div className='col p-2' style={{ border: "1px solid #5757FF", backgroundColor: "#CCE5F3", borderRadius: '10px', height: 'fit-content', maxWidth: '700px' }}>
                                <h6 className='fw-bold bg-primary text-white rounded p-1' >รอจัดคิว </h6>
                                {rightItems.tasks.length === 0 && (
                                    <div style={{ color: 'red', fontWeight: 'bold' }}>ไม่พบข้อมูล</div>
                                )}
                                <div className='row'>
                                    <div className='col' style={{ width: '800px' }}><ColumsRight tasks={rightItems.tasks} /></div>
                                </div>
                                <h6>ประวัติ</h6>
                                <div style={{ height: '700px', overflowY: 'auto' }}>
                                    <table className="table table-bordered table-striped " style={{ maxHeight: '700px' }}>
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">1</th>
                                                <th scope="col">2</th>
                                                <th scope="col">3</th>
                                                <th scope="col">4</th>
                                                <th scope="col">ลูก</th>
                                                <th scope="col">สนาม</th>
                                                <th scope="col">เวลา</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {historys.map((history, index) => (
                                                <tr key={index + 1}>
                                                    <th>{index + 1}</th>
                                                    <td>{history.player1_nickname ?? '-'}</td>
                                                    <td>{history.player2_nickname ?? '-'}</td>
                                                    <td>{history.player3_nickname ?? '-'}</td>
                                                    <td>{history.player4_nickname ?? '-'}</td>
                                                    <td>{history.shuttle_cock} ({history.shuttlecock_code})</td>
                                                    <td>{history.court}</td>
                                                    <td>{history.time}</td>

                                                </tr>
                                            ))}

                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    </div>
                </DragDropContext >
            </div >

            <div className='mt-3 p-2' style={{ width: '100%', border: "1px solid #5757FF", backgroundColor: "#7A7AF9", borderRadius: '10px', height: 'auto', display: 'flex', gap: "0.1rem", flexDirection: 'row', flexWrap: 'wrap' }}>
                {data.map((item, index) => (
                    <Flex
                        key={index}
                        m={"0.1rem"}
                        maxWidth={"400px"}
                        rounded="8px"
                        textAlign="center"
                        outline="0px solid transparent"
                        bg={item.isStudent === IsStudentEnum.Student ? "#BEF7C7" : item.isStudent === IsStudentEnum.University ? "#FFD7B5" : '#FFFFFF'}
                        align="center"
                        flexDirection={"column"}
                        zIndex={1}
                    >
                        <Button
                            className='btn btn-sm btn-light px-3 py-2'
                            onClick={() => { getRegisById(item.id) }}>
                            <span className='mx-3'>{`${item.nickname}`}</span>
                        </Button>
                    </Flex>
                ))
                }
            </div>

            <Modal show={regisDetail !== null} onHide={() => setRegisDetail(null)} centered >
                <Modal.Header closeButton>
                    <Modal.Title>แสดงจำนวนลูกแบด</Modal.Title>
                </Modal.Header>
                <Modal.Body className='w-100 m-auto'>
                    <div className='detail'>
                        <div className='d-flex justify-content-between'>
                            <p>ชื่อลูกค้า</p>
                            <p>{regisDetail?.nickname}</p>
                        </div>
                        {shuttleCockTypes.map((type) => {
                            const matched = regisDetail?.shuttlecock_details?.find(
                                (detail) => detail.shuttlecock_type_id === type.id
                            );
                            const quantity = matched?.quantity || 0;

                            return (
                                <div key={type.id} className="d-flex justify-content-between align-items-center">
                                    <p className="mb-0">{type.label}</p>
                                    <ShuttleCockControl
                                        buffetId={regisDetail?.id!}
                                        shuttlecockTypeId={type.id}
                                        initialQty={quantity}
                                        readonly={true}
                                    />
                                </div>
                            );
                        })}

                        <div className='d-flex justify-content-between mt-2'>
                            <p>รวมค่าลูก</p>
                            <div className='d-flex flex-column text-end'>
                                {shuttleCockTypes.map((type) => {
                                    const matched = regisDetail?.shuttlecock_details?.find(
                                        (detail) => detail.shuttlecock_type_id === type.id
                                    );
                                    const quantity = matched?.quantity || 0;

                                    return (
                                        <div key={type.id}>
                                            <p>{type.name} {quantity} ลูก = {(Number(type.price) / 4) * quantity} บาท</p>
                                        </div>
                                    );
                                })}</div>
                        </div>
                    </div>

                </Modal.Body>
            </Modal>

        </>
    )
}

export default Buffets;