import React, { useState, useEffect, useRef } from "react";
import toast, { Toaster } from 'react-hot-toast';
import {
  DragDropContext,
  Droppable,
  Draggable,
  resetServerContext,
} from "react-beautiful-dnd";

// Components
import Card from "./Card";
import Tooltip from "./Tooltip";
import TaskModal from "../Modals/TaskModal";

// Utils
import { getEmptyTask, getEmptyGroup, updateTaskValue, move, reorder } from 'public/utils';

// Constants
import { initialModalData, initialNewTaskData, socialLink } from 'public/constants';

// Icon
import DeleteIcon from 'public/assets/icons/deleteIcon.js';

// Styles
import s from "../styles/Canvas.module.css";
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
  background: isDragging ? "rgba(var(--card-color), 0.8)" : "rgb(var(--card-color))",
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
  const [state, setState] = useState([getEmptyGroup('No Status', false)]);
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
    toast.success('Group deleted successfully');
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
    toast.success('Task deleted successfully');
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

  const handleInput = (groupId = '', taskId = '') => event => {
    event.stopPropagation();
    const { value, name } = event.target;
    if (name === 'newGroupTitle') {
      if (value) {
        setState([...state, getEmptyGroup(value)]);
        toast.success(`New Group Added: ${value}`);
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

  const openModal = (taskId, groupId) => () => {
    if (!newTask?.isAdding) {
      setTaskModal(
        { ...taskModal, 
          show: true, 
          info: {
            groupId,
            taskId,
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

  // Data Persistance
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
    toast(
      <span>
        Built by&nbsp;
        <a href={socialLink.linkedIn} target="_blank">Shashwat Bagaria</a>
      </span>, {
      duration: 271096, //my birth date 🎂
      icon: '🕺',
      ariaProps: {
        role: 'status',
        'aria-live': 'polite',
      },
    });
  }, []);

  return (
    <div className={s.taskBoard}>
      {taskModal.show && (
        <TaskModal 
          state={state}
          setState={setState}
          meta={taskModal?.info}
          handleDeleteTask={handleDeleteCard(taskModal?.info.groupId, taskModal?.info.taskId)}
          onClose={() => setTaskModal(initialModalData)}
        />
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        {state.map(el => {
          const { id: groupId, name: groupName, colorHex, tasks, canDelete } = el;
          return (
          <Droppable key={groupId} droppableId={groupId}>
            {(provided, snapshot) => (
              <div className={s.taskStackContainer}>
                <div className={`${s.groupContainer} ${!canDelete && s.noStatusColumn}`}>
                  <p className={s.groupTitle}>
                    {groupName}
                    <span>{tasks.length}</span>
                  </p>
                  <Tooltip tooltipText="Add new task" placement='top'>
                    <button onClick={toggleNewTask(groupId)} className={`${s.addNewTask} ${s.addNewTaskPlus}`}>+</button>
                  </Tooltip>
                  {canDelete && <button
                    className={`${cardStyles.deleteBtn} ${s.deleteIcon}`}
                    type="button"
                    onClick={handleDeleteGroup(groupId)}
                  >
                    <DeleteIcon alt="Delete Icon" />
                  </button>}
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
                              onClick={openModal(task?.id, groupId)}
                              task={task}
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
      <Toaster 
        position="bottom-right"
        gutter={10}
        toastOptions={{
          duration: 5000,
          style: {
            background: 'rgb(var(--card-color))',
            color: 'var(--color-switch)',
          },
        }}
      />
    </div>
  );
}

export default Canvas;
