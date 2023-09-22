
import { Center, Flex, Text } from "@chakra-ui/react";
import { th, tr } from "date-fns/locale";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Droppable } from "react-beautiful-dnd";
import { Button } from 'react-bootstrap';

const Column = ({ tasks, index}) => {
    return (
        <div style={{ width: '700px' }}>
            <Droppable droppableId={`left-${index}`} direction="horizontal">
                {(droppableProvided) => (

                    <Flex
                        maxWidth={"100%"}
                        height={"45px"}
                        {...droppableProvided.droppableProps}
                        ref={droppableProvided.innerRef}
                    >
                        {tasks.map((task, index) => (
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
                                            width={"150px"}
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
                                {index === 1 && (

                                    <Flex
                                        m={"0.2rem"}
                                        p={"0"}
                                        width={"50px"}
                                        rounded="3px"
                                        textAlign="center"
                                        _active={{ bg: "white" }}
                                        outline="0px solid transparent"

                                        align="center"
                                        flexDirection={"column"}
                                        zIndex={1}

                                    >
                                        <span className="p-1 fs-5 text-white fw-bold">VS</span>
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

export default Column;