import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';
import dynamic from 'next/dynamic';
import { DragDropContext } from "react-beautiful-dnd";
import { Flex } from '@chakra-ui/react';
import Swal from 'sweetalert2';
const AdminLayout = dynamic(() => import('@/components/AdminLayout'));


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
export const getServerSideProps = async ({ req }: any) => {
    const sessiontoken = req.cookies.sessionToken;

    if (!sessiontoken) {
        return {
            redirect: {
                destination: '/admin/login',
                permanent: false,
            },
        };
    } else {
        return {
            props: {
            },
        };
    }
}


const ColumsLeft = dynamic(() => import("./columsLeft"), { ssr: false });
const ColumsRight = dynamic(() => import("./columsRight"), { ssr: false });
function buffet() {


    const [leftItems, setLeftItems] = useState<ItemsType>(initialLeftItems);
    const [rightItems, setRightItems] = useState<any>(initialRightItems);
    const elements = [];
    const numberOfProperties = Object.keys(leftItems).length;
    useEffect(() => {
        fetchRegis();
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

    const fetchRegis = async () => {
        try {
            const response = await fetch(`/api/admin/buffet/getRegis`)
            if (response.ok) {
                const data = await response.json();
                const newRightItems = { ...leftItems };
                const notQdata = data.filter((item: Buffet) => item.q_id === null);
                const newTasks = notQdata.map((item: Buffet) => ({
                    id: item.id,
                    content: `${item.name}(${item.nickname})`,
                    q_list: item.q_list || 0,
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
                <ColumsLeft tasks={entries[i][1]} index={i} />
                <Button className='btn btn-warning ' onClick={() => clearArray(entries[i][1], i)}>Clear</Button>
            </div>
        );

    }
    const clearArray = async (value: any, index: number) => {

        const updatedLeftItems: Record<string, any> = { ...leftItems };

        for (let i = index; i < numberOfProperties - 1; i++) {
            const currentColName = `T${i}`;
            const nextColName = `T${i + 1}`;

            // Copy data from the next column to the current column
            updatedLeftItems[currentColName] = [...leftItems[nextColName]];

            // Clear the next column
            updatedLeftItems[nextColName] = [];
        }
        setLeftItems(updatedLeftItems);


        // setRightItems(updatedRightItems);

        const right: any = value
        for (let i = 0; i < right.length; i++) {
            right[i].q_list = i + 1
        }
        const newState: any = {
            ...rightItems,
            tasks: [...rightItems.tasks, ...right],

        };
        setRightItems(newState);

        try {
            const response = await fetch(`/api/admin/buffet/updateQ?q_id=${null}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(right),
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
            }
        } catch (err) {
            console.error(err)
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

    return (
        <AdminLayout>
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
        </AdminLayout>
    )
}

export default buffet