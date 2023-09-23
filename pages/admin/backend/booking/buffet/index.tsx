import React, { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout';
import { Button } from 'react-bootstrap';
import dynamic from 'next/dynamic';
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const ColumsLeft = dynamic(() => import("./columsLeft"), { ssr: false });
const ColumsRight = dynamic(() => import("./columsRight"), { ssr: false });

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
function buffet() {
    const [state1, setState1] = useState(initialLeftItems);
    const [state2, setState2] = useState<Buffet>();
    const [leftItems, setLeftItems] = useState<LeftItemsType>(initialLeftItems);
    const [rightItems, setRightItems] = useState<any>(initialRightItems);

    const [placeholderProps, setPlaceholderProps] = useState({});

    const elements = [];
    const numberOfProperties = Object.keys(leftItems).length;

    const fetchRegis = async () => {
        try {
            const res = await fetch(`/api/admin/buffet/getRegis`)
            const data = await res.json()
            setState2(data);

            const notQdata = data.filter((item: Buffet) => item.q_id === null);
            const newTasks = notQdata.map((item: Buffet) => ({
                id: item.id,
                content: `${item.name}(${item.nickname})`,
            }));
            const newRightItems = {
                ...rightItems,
                tasks: [...rightItems.tasks, ...newTasks],
            };
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
                    q_list: item.q_list || 0, // ใช้ 0 ถ้า q_list ไม่มีค่า
                }));

                newTasksLeft.sort((a: Buffet, b: Buffet) => a.q_list - b.q_list);
                newLeftItems[colname] = newTasksLeft;
            }

            setLeftItems(newLeftItems);



        } catch (error) {
            console.error(error)
        }

    }
    useEffect(() => {
        fetchRegis();
    }, [])


    for (let i = 0; i < numberOfProperties; i++) {
        const entries = Object.entries(leftItems)
        elements.push(
            <div className='d-flex flex-row mb-1 p-1' style={{ backgroundColor: '#7A7AF9', borderRadius: '8px' }}>
                <ColumsLeft key={i} tasks={entries[i][1]} index={i} />
                <Button onClick={() => clearArray(entries[i][1], i)}>Clear</Button>
            </div>
        )

    }
    const clearArray = (value: any, index: number) => {

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

        const updatedRightItems = {
            ...rightItems,
            tasks: [...rightItems.tasks, ...value],
        };
        setRightItems(updatedRightItems);
    };

    const onDragEnd = async (result: any) => {
        if (!result.destination) return;

        const { source, destination } = result;

        if (source.droppableId === destination.droppableId) {
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
                } else if (source.droppableId === `right`) {
                    const reorderedItems = Array.from(rightItems.tasks);
                    const [removedItem] = reorderedItems.splice(source.index, 1);
                    reorderedItems.splice(destination.index, 0, removedItem);
                    const newState: any = {
                        ...rightItems,
                        tasks: reorderedItems,
                    };
                    setRightItems(newState);
                }
            }
        } else {

            let sourceItems = [];
            let destinationItems = [];
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
                } else if (destination.droppableId === `left-${i}`) {
                    destinationItems = Object.entries(leftItems)[i][1];
                }
            }
            if (destinationItems.length < 4 || destination.droppableId === 'right') {
                const [movedItem] = sourceItems.splice(source.index, 1);
                destinationItems.splice(destination.index, 0, movedItem);
                
                for (let i = 0; i < destinationItems.length; i++) {
                    destinationItems[i].q_list = i + 1
                }
                console.log("destination" ,destination.index  ,"source" ,source  ,"destinationItems" ,destinationItems)
                console.log(leftItems)

            }
        }
    };





    return (
        <AdminLayout>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className='container-fluid text-center' style={{ overflow: 'hidden' }}>
                    <h4>จัดคิวตีบุฟเฟ่ต์</h4>
                    <div className='row'>

                        <div className='col me-3 p-2' style={{ border: "1px solid #5757FF", backgroundColor: "#CCE5F3", borderRadius: '10px' }}>
                            <h6 className='fw-bold bg-primary text-white rounded p-1' >คิวการเล่น</h6>
                            {elements}
                        </div>
                        <div className='col  p-2' style={{ border: "1px solid #5757FF", backgroundColor: "#CCE5F3", borderRadius: '10px' }}>
                            <h6 className='fw-bold bg-primary text-white rounded p-1' >ผู้จองตีบุฟเฟต์วันนี้</h6>
                            {rightItems.tasks.length === 0 && (
                                <div style={{ color: 'red', fontWeight: 'bold' }}>ไม่พบข้อมูล</div>
                            )}
                            <ColumsRight tasks={rightItems.tasks} />
                        </div>
                    </div>
                </div>
            </DragDropContext>
        </AdminLayout>
    )
}
interface LeftItemsType {
    [key: string]: string[];
}
const initialLeftItems: LeftItemsType = {
    T0: [

    ],
    T1: [

    ],
    T2: [

    ],
    T3: [

    ],
    T4: [

    ],
    T5: [

    ],
    T6: [

    ],
    T7: [

    ],
    T8: [

    ],
    T9: [

    ],
}

const initialRightItems = {
    tasks: [

    ],
}
export default buffet