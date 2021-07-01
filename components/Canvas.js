import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  resetServerContext,
} from "react-beautiful-dnd";

// Components
import Card from "./Card";
import Modal from "./Modal";
import Tooltip from "./Tooltip";
import Image from 'next/image';

// Icon
import DeleteIcon from 'public/assets/icons/delete-icon.png';

// Styles
import s from "../styles/Canvas.module.css";
import cardStyles from "../styles/Card.module.css";

// Fake Data
const getItems = (count, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k + offset}-${new Date().getTime() + k}`,
    content: `Task ${k + offset}`,
  }));

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const grid = 8;

const getItemStyle = (snapshot, isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  boxShadow:
    "rgb(15 15 15 / 10%) 0px 0px 0px 1px, rgb(15 15 15 / 10%) 0px 2px 4px",
  display: "block",
  color: "inherit",
  textDecoration: "none",
  boxShadow:
    "rgb(15 15 15 / 10%) 0px 0px 0px 1px, rgb(15 15 15 / 10%) 0px 2px 4px",
  borderRadius: "3px",
  marginBottom: "8px",
  background: "white",
  overflow: "hidden",
  transition: "background 100ms ease-out 0s",
  padding: "8px 10px 10px",

  // change background colour if dragging
  background: isDragging ? "rgba(55, 53, 47, 0.03)" : "white",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  padding: grid,
  width: 300,
});

function Canvas() {
  const [state, setState] = useState([getItems(5), getItems(5, 5)]);
  const [showModal, setShowModal] = useState(false);
  const onDragEnd = (result) => {
    const { source, destination } = result;

    // If dropped outside the list
    if (!result.destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;
    if (sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
      newState[sInd] = items;
      setState(newState);
    } else {
      const result = move(state[sInd], state[dInd], source, destination);
      const newState = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      setState(newState);
    }
  };

  const handleDeleteGroup = (ind) => () => {
    const newState = [...state];
    newState.splice(ind, 1)
    setState(newState);
  };

  const handleDeleteCard = (ind, index) => (event) => {
    event.stopPropagation();
    const newState = [...state];
    newState[ind].splice(index, 1);
    setState(newState);
  };

  const addTaskInGroup = (groupIndex) => () => {
      console.log(groupIndex);
    const newState = state.map((group, idx) => {
        if (idx === groupIndex) {
            return [...group, ...getItems(1)];
        }
        return group;
    })
    setState(newState);
  };

  const addNewGroup = () => {
    setState([...state, []]);
  }

  function handleContentEditable(event) {
    console.log(event.target.innerText);
  }

  useEffect(() => {
    resetServerContext();
  }, []);
  
  return (
    <div className={s.taskBoard}>
      <Modal show={showModal} onClose={() => setShowModal(false)} title={'Task Title'}>
        Task Description Nulla esse sit deserunt tempor quis.
        Exercitation esse ipsum adipisicing tempor do tempor culpa minim quis in laboris. Velit ut nostrud incididunt irure do ex. Aliqua excepteur sint eu ullamco ut.
        Proident labore cupidatat veniam laboris.
        Adipisicing aliquip duis incididunt pariatur commodo ut voluptate duis commodo sunt eu.
        Sint anim aliquip aliquip excepteur. Voluptate officia aliqua labore commodo nostrud non irure.
        Sit nisi commodo nostrud incididunt ipsum reprehenderit reprehenderit ut minim aliqua voluptate labore. Id magna esse incididunt sint. Proident nisi enim sint excepteur amet amet voluptate ut veniam. Deserunt esse deserunt ad commodo labore adipisicing aliqua velit eiusmod cupidatat laboris.
        Ex nulla aliqua laborum do anim ea reprehenderit. Qui laboris ipsum deserunt aliquip aute dolor sunt ut magna reprehenderit sint amet cillum.
        Laboris voluptate proident aliqua nulla mollit deserunt consequat nisi ea minim.
      </Modal>
      <DragDropContext onDragEnd={onDragEnd}>
        {state.map((el, ind) => (
          <Droppable key={ind} droppableId={`${ind}`}>
            {(provided, snapshot) => (
              <div className={s.taskStackContainer}>
                <div className={s.groupContainer}>
                  <p
                    className={s.groupTitle}
                    contentEditable={true}
                    onChange={(event) => handleContentEditable(event)}
                    onInput={(event) => handleContentEditable(event)}
                    >
                      Group Title {ind+1}
                      <span>{el.length}</span>
                  </p>
                  <Tooltip tooltipText="Create New Group" placement='top'>
                    <button onClick={addTaskInGroup(ind)} className={`${s.addNewTask} ${s.addNewTaskPlus}`}>+</button>
                  </Tooltip>
                  <button
                    className={`${cardStyles.deleteBtn} ${s.deleteIcon}`}
                    type="button"
                    onClick={handleDeleteGroup(ind)}
                  >
                    <Image src={DeleteIcon} alt="Delete Icon" width={12} height={20} /> 
                  </button>
                </div>
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                >
                  {el.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={`draggable-${item.id}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot,
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <Card
                            handleDeleteTask={handleDeleteCard(ind, index)}
                            onClick={() => setShowModal(true)}
                          >
                            {item.content}
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
                <button onClick={addTaskInGroup(ind)} className={s.addNewTask}>
                  + New Task
                </button>
              </div>
            )}
          </Droppable>
        ))}
        <button onClick={addNewGroup} className={`${s.addNewTask} ${s.addGroupBtn}`}>
          <p>+ Add a Group</p>
        </button>
      </DragDropContext>
    </div>
  );
}

export default Canvas;
