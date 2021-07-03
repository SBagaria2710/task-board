import React, { useState, useEffect, useRef } from "react";
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
import TaskModal from "../Modals/TaskModal";
import Image from 'next/image';

// Utils
import { getEmptyTask, getEmptyGroup, updateTaskValue, move, reorder } from 'public/utils';

// Constants
import { initialModalData, initialNewTaskData } from 'public/constants';

// Icon
import DeleteIcon from 'public/assets/icons/delete-icon.png';

// Styles
import s from "../styles/Canvas.module.css";TaskModal
import cardStyles from "../styles/Card.module.css";

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
  const groupInputRef = useRef('');
  const taskInputRef = useRef('');
  const [state, setState] = useState([]);
  const [taskModal, setTaskModal] = useState(initialModalData);
  const [isEditingNewGroupName, setIsEditingNewGroupName] = useState(false);
  const [newTask, setNewTask] = useState(initialNewTaskData);

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

  const addTaskInGroup = (groupId) => {
    const newState = state.map(group => {
      const { id, tasks } = group;
      if (groupId === id) {
        return { ...group, tasks: [...tasks, getEmptyTask()]}
      }
      return group;
    });
    setState(newState);
  };

  const toggleIsEditingNewGroupName = () => setIsEditingNewGroupName(!isEditingNewGroupName);
  const toggleNewTask = (groupId) => () => {
    addTaskInGroup(groupId);
    setNewTask({ ...newTask, isAdding: !newTask?.isAdding, groupId})
  };

  const handleKeyUp = (groupId = '', taskId = '') => event => {
    const { value, name } = event.target;
    if ((event.key === 'Escape' || event.key === 'Enter')) {
      if (name === 'newGroupTitle') {
        if (value) {
          setState([...state, getEmptyGroup(value)]);
          toggleIsEditingNewGroupName();
        } else {
          toggleIsEditingNewGroupName();
        }
      } else if (name === 'newTaskTitle') {
        const newState = updateTaskValue(state, groupId, taskId, 'title', value);
        setState(newState);
        setNewTask({ ...newTask, ...initialNewTaskData })
      }
    }
  }

  const handleInput = (groupId = '', taskId = '') => (event) => {
    event.stopPropagation();
    const { value, name } = event.target;
    if (name === 'newGroupTitle') {
      if (value) {
        setState([...state, getEmptyGroup(value)]);
        toggleIsEditingNewGroupName();
      } else {
        toggleIsEditingNewGroupName();
      }
    } else if (name === 'newTaskTitle') {
      const newState = updateTaskValue(state, groupId, taskId, 'title', value);
      setState(newState);
      setNewTask({ ...newTask, ...initialNewTaskData })
    }
  }

  const openModal = (task, groupId) => () => {
    if (!newTask?.isAdding) {
      setTaskModal(
        { ...taskModal, 
          show: true, 
          info: {
            groupId,
            taskId: task.id,
          }
      });
    }
  }

  useEffect(() => {
    if (isEditingNewGroupName) {
      groupInputRef.current.focus();
    }
  }, [isEditingNewGroupName]);

  useEffect(() => {
    if (newTask.isAdding) {
      taskInputRef.current.focus();
    }
  }, [newTask.isAdding]);

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
      {taskModal.show && <TaskModal onClose={() => setTaskModal(initialModalData)} meta={taskModal?.info} state={state} setState={setState} />}
      <DragDropContext onDragEnd={onDragEnd}>
        {state.map(el => {
          const { id: groupId, name: groupName, colorHex, justCreated, tasks } = el;
          return (
          <Droppable key={groupId} droppableId={groupId}>
            {(provided, snapshot) => (
              <div className={s.taskStackContainer}>
                <div className={s.groupContainer}>
                  <p className={s.groupTitle}>
                    {groupName}
                    <span>{tasks.length}</span>
                  </p>
                  <Tooltip tooltipText="Create New Group" placement='top'>
                    <button onClick={toggleNewTask(groupId)} className={`${s.addNewTask} ${s.addNewTaskPlus}`}>+</button>
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
                              onClick={openModal(task, groupId)}
                            >
                              {task?.isNew ? (
                                <div className={`${s.newTitleWrapper} ${s.newTaskTitleWrapper}`}>
                                  <input
                                    ref={taskInputRef}
                                    name="newTaskTitle"
                                    placeholder="Task Title..."
                                    autoComplete="off"
                                    className={s.newGroupTitle}
                                    onBlur={handleInput(groupId, task?.id)}
                                    onKeyUp={handleKeyUp(groupId, task?.id)}
                                  />
                                </div>
                              ) : (task?.title ? <p className={s.title}>{task?.title}</p> : <span className={s.untitledTask}>Untitled</span>)}
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    )}
                  )}
                  {provided.placeholder}
                </div>
                <button onClick={toggleNewTask(groupId)} className={s.addNewTask}>
                  + New Task
                </button>
              </div>
            )}
          </Droppable>
        )})}
        {isEditingNewGroupName ? (
        <div className={`${s.newTitleWrapper} ${s.newGroupTitleWrapper}`}>
          <input 
            ref={groupInputRef}
            name="newGroupTitle"
            placeholder="Group Name"
            className={s.newGroupTitle}
            onBlur={handleInput()}
            onKeyUp={handleKeyUp()}
            autoComplete="off"
          />
        </div>
        ) : (
        <button onClick={toggleIsEditingNewGroupName} className={`${s.addNewTask} ${s.addGroupBtn}`}>
          <p>+ Add a Group</p>
        </button>
        )}
      </DragDropContext>
    </div>
  );
}

export default Canvas;
