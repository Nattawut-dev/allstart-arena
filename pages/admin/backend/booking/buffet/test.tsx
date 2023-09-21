import { Flex, Heading, Text } from "@chakra-ui/react";
import { curry, isEmpty } from "lodash";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const Column = dynamic(() => import("./colums"), { ssr: false });

const reorderTasks = (tasks: any, startIndex: any, endIndex: any) => {
  const newTaskList = Array.from(tasks);
  const [removed] = newTaskList.splice(startIndex, 1);
  newTaskList.splice(endIndex, 0, removed);
  return newTaskList;
};

export default function Home() {

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
      if (source.droppableId === 'col') {
        const reorderedItems = Array.from(leftItems.tasks);
        const [removedItem] = reorderedItems.splice(source.index, 1);
        reorderedItems.splice(destination.index, 0, removedItem);
        const newState: any = {
          ...leftItems,
          tasks: reorderedItems,
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
      const sourceItems = source.droppableId === 'col' ? leftItems.tasks : rightItems.tasks;
      const destinationItems = destination.droppableId === 'col' ? leftItems.tasks : rightItems.tasks;
      const [movedItem] = sourceItems.splice(source.index, 1);
      destinationItems.splice(destination.index, 0, movedItem);
      setLeftItems(leftItems);
      setRightItems(rightItems);
    }
    console.log("left" ,leftItems.tasks)
    console.log("right" ,rightItems.tasks)

  };



  return (
    <DragDropContext
      onDragEnd={onDragEnd}
    >
      <Flex
        flexDir="column"
        bg="main-bg"
        minH="100vh"
        w="full"
        color="white-text"
        pb="2rem"
      >
        <Flex py="4rem" flexDir="column" align="center">
          <Heading fontSize="3xl" fontWeight={600}>
            react-beautiful-dnd
          </Heading>
          <Text fontSize="20px" fontWeight={600} color="subtle-text"></Text>
        </Flex>

        <Flex justify="center" px="4rem">
          <Column placeholderProps={placeholderProps} tasks1={leftItems.tasks} tasks2={rightItems.tasks} />
        </Flex>
      </Flex>
    </DragDropContext>
  );
}


const initialLeftItems = {
  tasks: [
    { id: 1, content: 'Item 1' },
    { id: 2, content: 'Item 2' },
    { id: 3, content: 'Item 3' },
  ],
}

const initialRightItems = {
  tasks: [
    { id: 4, content: 'Item 4' },
    { id: 5, content: 'Item 5' },
    { id: 6, content: 'Item 6' },
  ],
}