import React, { useEffect, useState, useRef } from 'react';

// Components
import Modal from "../components/Modal";
import Image from 'next/image';

// Icon
import DeleteIcon from 'public/assets/icons/deleteIcon.js';
import SaveIcon from 'public/assets/icons/saveIcon.js';
import EditIcon from 'public/assets/icons/editIcon.js';

// Utils
import { updateTaskValue, getTaskObj } from 'public/utils';

// Styles
import s from "../styles/TaskModal.module.css";

function TaskModal({ state, setState, meta, onClose, handleDeleteTask }) {
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const { taskId, groupId } = meta;
  const taskObj = getTaskObj(state, groupId, taskId);
  const { title, description } = taskObj;
  const [isEditMode, setIsEditMode] = useState(false);

  const handleInput = (groupId = '', taskId = '', key) => (event) => {
    event.stopPropagation();
    const { value, name } = event.target;
    if ((name === 'newTitle' || name === 'newDesc') && value) {
      const newState = updateTaskValue(state, groupId, taskId, key, value);
      setState(newState);
    }
  }

  const toggleEditMode = () => {
    setIsEditMode((isEditMode) => !isEditMode);
};

  const deleteTaskAndCloseModal = (event) => {
    handleDeleteTask(event);
    onClose();
  }

  useEffect(() => {
    if (!title) {
      setTimeout(() => titleRef.current.focus(), 0);
    } else if (!description) {
      setTimeout(() => descriptionRef.current.focus(), 0);
    }
  }, []);

  return (
  <Modal show onClose={onClose}>
    <div className={s.actionContainer}>
      <p className={s.actionTitle}>Actions</p>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={toggleEditMode} className={s.deleteBtn}>
          {isEditMode ? 'Save' : 'Edit'}
          {isEditMode ? <SaveIcon /> : <EditIcon />}
        </button>
        <button onClick={(event) => deleteTaskAndCloseModal(event)} className={s.deleteBtn}>
          Delete Task
          <DeleteIcon />
        </button>
      </div>
    </div>
    {(!title) ? (
      <div className={`${s.wrapper} ${s.titleInput}`}>
        <input
          ref={titleRef}
          name="newTitle"
          placeholder="Untitled"
          autoComplete="off"
          value={title}
          // onChange={handleInput(groupId, taskId, 'title')}
          onBlur={handleInput(groupId, taskId, 'title')}
        />
      </div>
    ) : (
    <h1 className={s.title}>{title}</h1>
    )}
    {(!description) ? (
      <div className={`${s.wrapper} ${s.descriptionInput}`}>
        <input
          ref={descriptionRef}
          name="newDesc"
          placeholder="Start typing description..."
          autoComplete="off"
          value={description}
          // onChange={handleInput(groupId, taskId, 'description')}
          onBlur={handleInput(groupId, taskId, 'description')}
        />
      </div>
    ) : (<div className={s.modalBody}>{description}</div>)}
  </Modal>);
}

export default TaskModal;



// For contentEditable using onBlur event
//
// const handleEditableContent = (groupId = '', taskId = '', key) => (event) => {
//   event.stopPropagation();
//   const { textContent, attributes } = event.target;
//   const name = attributes.getNamedItem('name').value;
//   if ((name === 'title' || name === 'newDesc') && textContent) {
//     const newState = updateTaskValue(state, groupId, taskId, key, textContent);
//     setState(newState);
//   }
// }
