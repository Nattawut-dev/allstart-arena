import React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const initialLeftItems = [
  { id: 1, content: 'Item 1' },
  { id: 2, content: 'Item 2' },
  { id: 3, content: 'Item 3' },
];

const initialRightItems = [
  { id: 4, content: 'Item 4' },
  { id: 5, content: 'Item 5' },
  { id: 6, content: 'Item 6' },
];

const DragAndDrop = () => {
  const [leftItems, setLeftItems] = React.useState(initialLeftItems);
  const [rightItems, setRightItems] = React.useState(initialRightItems);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === 'left') {
        const reorderedItems = Array.from(leftItems);
        const [removedItem] = reorderedItems.splice(source.index, 1);
        reorderedItems.splice(destination.index, 0, removedItem);
        setLeftItems(reorderedItems);
      } else {
        const reorderedItems = Array.from(rightItems);
        const [removedItem] = reorderedItems.splice(source.index, 1);
        reorderedItems.splice(destination.index, 0, removedItem);
        setRightItems(reorderedItems);
      }
    } else {
      const sourceItems = source.droppableId === 'left' ? leftItems : rightItems;
      const destinationItems = destination.droppableId === 'left' ? leftItems : rightItems;
      const [movedItem] = sourceItems.splice(source.index, 1);
      destinationItems.splice(destination.index, 0, movedItem);
      setLeftItems([...leftItems]);
      setRightItems([...rightItems]);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="left">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                flex: 1,
                margin: '8px',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            >
              <h2>Left List</h2>
              {leftItems.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                  {(draggableProvided, draggableSnapshot) => (
                    <div
                      {...draggableProvided.dragHandleProps}
                      {...draggableProvided.draggableProps}
                      ref={draggableProvided.innerRef}
                      style={{
                        margin: '4px',
                        padding: '8px',
                        background: 'lightblue',
                        border: '1px solid #666',
                        borderRadius: '4px',
                      }}
                    >
                      {item.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <Droppable droppableId="right">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                flex: 1,
                margin: '8px',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            >
              <h2>Right List</h2>
              {rightItems.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        margin: '4px',
                        padding: '8px',
                        background: 'lightpink',
                        border: '1px solid #666',
                        borderRadius: '4px',
                      }}
                    >
                      {item.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default DragAndDrop;
