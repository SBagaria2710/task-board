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

// Utils
import { getEmptyTask, getEmptyGroup } from 'public/utils';

// Constants
import { initialModalData } from 'public/constants';

// Icon
import DeleteIcon from 'public/assets/icons/delete-icon.png';

// Styles
import s from "../styles/Canvas.module.css";
import cardStyles from "../styles/Card.module.css";

const reorder = (group, startIndex, endIndex) => {
  if (!group.length) return;
  const { tasks } = group[0];
  const result = Array.from(tasks);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return { ...group[0], tasks: result };
};

const move = (source, destination, droppableSource, droppableDestination) => {
  if (!(source?.length && destination?.length)) return;
  const { tasks: sourceTasks } = source[0];
  const { tasks: destinationTasks } = destination[0];
  const sourceClone = Array.from(sourceTasks);
  const destClone = Array.from(destinationTasks);
  const [removed] = sourceClone.splice(droppableSource.index, 1);
  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result['source'] = { ...source[0], tasks: sourceClone };
  result['destination'] = { ...destination[0], tasks: destClone };
  return result;
};

const getItemStyle = (snapshot, isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: '16px',
  margin: `0 0 8px 0`,
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

  // change background colour and cursor if dragging
  background: isDragging ? "rgba(55, 53, 47, 0.03)" : "white",
  cursor: isDragging ? "drag" : "pointer",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  padding: '8px',
  width: 300,
});

function Canvas() {
  const [state, setState] = useState([]);
  const [taskModal, setTaskModal] = useState(initialModalData);
  const onDragEnd = (result) => {
    const { source, destination } = result;
    // If dropped outside the list
    if (!result.destination) {
      return;
    }
    const sInd = source.droppableId;
    const dInd = destination.droppableId;

    if (sInd === dInd) {
      const selectedGroup = state.filter(group => group.id === sInd);
      const reorderedGroup = reorder(selectedGroup, source.index, destination.index);
      const newState = state.map(group => group.id === sInd ? reorderedGroup : group);
      setState(newState);
    } else {
      const fromGroup = state.filter(group => group.id === sInd);
      const toGroup = state.filter(group => group.id === dInd);
      const result = move(fromGroup, toGroup, source, destination);
      const newState = state.map(group => {
        if (group.id === sInd) {
          return result.source;
        } else if (group.id === dInd) {
          return result.destination;
        } else {
          return group;
        }
      });
      setState(newState);
    }
  };

  const handleDeleteGroup = (groupId) => () => {
    const newState = state.filter(group => !(group.id === groupId));
    setState(newState);
  };

  const handleDeleteCard = (groupId, taskId) => (event) => {
    event.stopPropagation();
    if (!(groupId || taskId)) return;
    const newState = state.map(group => {
      const { id, tasks } = group;
      if (groupId === id) {
        return { ...group, tasks: tasks.filter(task => !(taskId === task.id))}
      }
      return group;
    });
    setState(newState);
  };

  const addTaskInGroup = (groupId) => () => {
    const newState = state.map(group => {
      const { id, tasks } = group;
      if (groupId === id) {
        return { ...group, tasks: [...tasks, getEmptyTask()]}
      }
      return group;
    });
    setState(newState);
  };

  const addNewGroup = () => {
    setState([...state, getEmptyGroup()]);
  }

  function handleContentEditable(event) {
    console.log(event.target.innerText);
  }

  //Data Persistance
  useEffect(() => {
    const stateData = localStorage.getItem('task-board-state');
    const modalData = localStorage.getItem('modal-state');
    try {
      if (stateData) {
        setState(JSON.parse(stateData));
      }
      if (modalData) {
        setTaskModal(JSON.parse(modalData));
      }
    } catch(e) {
      console.error('ERROR: ', e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('task-board-state', JSON.stringify(state));
    localStorage.setItem('modal-state', JSON.stringify(taskModal));
  });

  useEffect(() => {
    resetServerContext();
  }, []);

  return (
    <div className={s.taskBoard}>
      <Modal show={taskModal.show} onClose={() => setTaskModal(initialModalData)} title={taskModal?.info?.title}>
        <p>{taskModal?.info?.description}</p>
      </Modal>
      <DragDropContext onDragEnd={onDragEnd}>
        {state.map((el, ind) => {
          const { id: groupId, name: groupName, colorHex, tasks } = el;
          return (
          <Droppable key={groupId} droppableId={groupId}>
            {(provided, snapshot) => (
              <div className={s.taskStackContainer}>
                <div className={s.groupContainer}>
                  <p
                    className={s.groupTitle}
                    // contentEditable={true}
                    // onChange={(event) => handleContentEditable(event)}
                    // onInput={(event) => handleContentEditable(event)}
                    >
                      {groupName || groupId}
                      <span>{tasks.length}</span>
                  </p>
                  <Tooltip tooltipText="Create New Group" placement='top'>
                    <button onClick={addTaskInGroup(groupId)} className={`${s.addNewTask} ${s.addNewTaskPlus}`}>+</button>
                  </Tooltip>
                  <button
                    className={`${cardStyles.deleteBtn} ${s.deleteIcon}`}
                    type="button"
                    onClick={handleDeleteGroup(groupId)}
                  >
                    <Image src={DeleteIcon} alt="Delete Icon" width={12} height={20} /> 
                  </button>
                </div>
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                >
                  {tasks.map((task, index) => {
                    return (
                    <Draggable
                      key={task?.id}
                      draggableId={`draggable-${task?.id}`}
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
                            handleDeleteTask={handleDeleteCard(groupId, task?.id)}
                            onClick={() => setTaskModal({ ...taskModal, show: true, info: { title: `Title ${task?.id}`, description:  `Description ${task?.id}` } })}
                          >
                            {task?.title || task?.id}
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  )})}
                  {provided.placeholder}
                </div>
                <button onClick={addTaskInGroup(groupId)} className={s.addNewTask}>
                  + New Task
                </button>
              </div>
            )}
          </Droppable>
        )})}
        <button onClick={addNewGroup} className={`${s.addNewTask} ${s.addGroupBtn}`}>
          <p>+ Add a Group</p>
        </button>
      </DragDropContext>
    </div>
  );
}

export default Canvas;
