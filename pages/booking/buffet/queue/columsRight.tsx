import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Droppable } from "react-beautiful-dnd";

const Column = ({ tasks }: any) => {
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

export default Column;
