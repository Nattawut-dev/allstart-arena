
import { Center, Flex, Text } from "@chakra-ui/react";
import { th } from "date-fns/locale";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Droppable } from "react-beautiful-dnd";
import { Button } from 'react-bootstrap';

const Column = ({ tasks }) => {
    return (
        <div>

<Droppable droppableId={`right`} direction="horizontal">
    {(droppableProvided) => (
        <Flex
            p="0.5rem"
            w={"500px"}
            {...droppableProvided.droppableProps}
            ref={droppableProvided.innerRef}
            css={{
                overflowX: 'auto', // เพิ่มการเลื่อนแนวนอน
                whiteSpace: 'nowrap', // ไม่ให้ข้อมูลตัดบรรทัด
                overflow: 'hidden', // ซ่อนเนื้อหาที่เกินขอบเขต
                textOverflow: 'ellipsis', // แสดง ... ถ้าข้อมูลเกินเขต
            }}
        >
            {tasks.map((task, index) => (
                <Draggable
                    key={task.id}
                    draggableId={task.id.toString()}
                    index={index}
                >
                    {(draggableProvided, draggableSnapshot) => (
                        <Flex
                            h="auto"
                            m={"0.5rem"}
                            bg="white"
                            rounded="3px"
                            textAlign="center"
                            _active={{ bg: "white" }}
                            outline="2px solid "
                            outlineColor={
                                draggableSnapshot.isDragging
                                    ? "card-border"
                                    : "transparent"
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
                            css={{
                                whiteSpace: 'nowrap', // ไม่ให้ข้อมูลตัดบรรทัด
                                overflow: 'hidden', // ซ่อนเนื้อหาที่เกินขอบเขต
                                textOverflow: 'ellipsis', // แสดง ... ถ้าข้อมูลเกินเขต
                            }}
                        >
                            <Text fontSize="20px" >{task.content}</Text>
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

export default Column;