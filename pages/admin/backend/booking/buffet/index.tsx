import React, { useState } from 'react'
import AdminLayout from '@/components/AdminLayout';
import { Button } from 'react-bootstrap';
import dynamic from 'next/dynamic';
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const Column = dynamic(() => import("./colums"), { ssr: false });
const ColumsLeft = dynamic(() => import("./columsLeft"), { ssr: false });
const ColumsRight = dynamic(() => import("./columsRight"), { ssr: false });

function buffet() {
    // const [state1, setState1] = useState(initialLeftItems);
    // const [state2, setState2] = useState(initialRightItems);
    const [leftItems, setLeftItems] = React.useState(initialLeftItems);
    const [rightItems, setRightItems] = React.useState(initialRightItems);

    const [placeholderProps, setPlaceholderProps] = useState({});


    // const onDragEnd = (result: any) => {
    //   const { source, destination } = result;

    //   // if the user drops outside of a droppable destination
    //   if (!destination) return;

    //   // If the user drags and drops back in the same position
    //   if (
    //     destination.droppableId === source.droppableId &&
    //     destination.index === source.index

    //   ) {
    //     return;
    //   }
    //   // If the user drops in a different postion
    //   console.log(source, destination)
    //   const { tasks } = leftItems;
    //   const newTasks = reorderTasks(tasks, source.index, destination.index);

    //   const newState: any = {
    //     ...leftItems,
    //     tasks: newTasks,
    //   };
    //   setLeftItems(newState);
    // };

    const onDragEnd = (result: any) => {
        if (!result.destination) return;

        const { source, destination } = result;

        if (source.droppableId === destination.droppableId) {
            if (source.droppableId === 'col-0') {
                const reorderedItems = Array.from(leftItems.T1);
                const [removedItem] = reorderedItems.splice(source.index, 1);
                reorderedItems.splice(destination.index, 0, removedItem);
                const newState: any = {
                    ...leftItems,
                    T1: reorderedItems,
                };
                setLeftItems(newState);
            } else if (source.droppableId === 'col-1') {
                const reorderedItems = Array.from(leftItems.T2);
                const [removedItem] = reorderedItems.splice(source.index, 1);
                reorderedItems.splice(destination.index, 0, removedItem);
                const newState: any = {
                    ...leftItems,
                    T2: reorderedItems,
                };
                setLeftItems(newState);
            } else {
                const reorderedItems = Array.from(rightItems.tasks);
                const [removedItem] = reorderedItems.splice(source.index, 1);
                reorderedItems.splice(destination.index, 0, removedItem);
                const newState: any = {
                    ...rightItems,
                    tasks: reorderedItems,
                };
                setRightItems(newState);
            }
        } else {
            let sourceItems;
            let destinationItems;

            if (source.droppableId === 'col-0') {
                sourceItems = leftItems.T1;
            } else if (source.droppableId === 'col-1') {
                sourceItems = leftItems.T2;
            } else {
                sourceItems = rightItems.tasks;
            }

            if (destination.droppableId === 'col-0') {
                destinationItems = leftItems.T1;
            } else if (destination.droppableId === 'col-1') {
                destinationItems = leftItems.T2;
            } else {
                destinationItems = rightItems.tasks;
            }

            const [movedItem] = sourceItems.splice(source.index, 1);
            destinationItems.splice(destination.index, 0, movedItem);

            const newLeftItems = {
                ...leftItems
            };

            const newRightItems = {
                ...rightItems

            };

            setLeftItems(newLeftItems);
            setRightItems(newRightItems);
        }
        console.log("left", leftItems.T1);
        console.log("right", rightItems.tasks);
    };



    const elements = [];
    const numberOfProperties = Object.keys(leftItems).length;
    for (let i = 0; i < numberOfProperties; i++) {
        const entries = Object.entries(leftItems)

        elements.push(<ColumsLeft key={i} tasks={entries[i][1]} index={i} />)
        console.log(entries[i][1])
        console.log(leftItems)
    }

    return (
        <AdminLayout>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className='container-fluid text-center'>
                    <div className='row'>
                        {/* 
                        <table className="table table-bordered table-striped  table-sm col me-5">
                            <thead>
                                <tr>
                                    <th scope="col">Q</th>
                                    <th scope="col">Player 1</th>
                                    <th scope="col">Player 2</th>
                                    <th scope="col">Player 3</th>
                                    <th scope="col">Player 4</th>
                                    <th scope="col">Action</th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">1</th>
                                    <td>ณัฐวุฒิ (ปาน)</td>
                                    <td>ณัฐวุฒิ (ปาน)</td>
                                    <td>ณัฐวุฒิ (ปาน)</td>
                                    <td>ณัฐวุฒิ (ปาน)</td>
                                    <td ><Button className='btn btn-sm'>Endgame</Button></td>
                                </tr>

                            </tbody>
                        </table> */}


                        <div className='col me-5 bg-dark-subtle' >
                            {elements}
                        </div>
                        <div className='col me-5 bg-dark-subtle' >
                            <ColumsRight tasks={rightItems.tasks} />
                            {/* <Column placeholderProps={placeholderProps} tasks1={leftItems.T1} tasks2={rightItems.tasks} /> */}
                        </div>
                    </div>
                </div>
            </DragDropContext>
        </AdminLayout>
    )
}
const initialLeftItems = {
    T1: [
        { id: 1, content: 'Item 1' },
        { id: 2, content: 'Item 2' },
        { id: 3, content: 'Item 3' },
    ],
    T2: [
        { id: 7, content: 'Item 7' },
        { id: 8, content: 'Item 8' },
        { id: 9, content: 'Item 9' },
    ],
}

const initialRightItems = {
    tasks: [
        { id: 4, content: 'Item 4' },
        { id: 5, content: 'Item 5' },
        { id: 6, content: 'Item 6' },
    ],
}
export default buffet