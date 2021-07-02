import React, { useState, useEffect, useRef } from 'react';

// Components
import Modal from "../components/Modal";

// Utils
import { updateTaskValue } from 'public/utils';

// Styles
import s from "../styles/TaskModal.module.css";

function TaskModal({ onClose, taskObj, state, setState }) {
  const titleRef = useRef('');
  const { task, groupId, title, description } = taskObj;

  const handleInput = (groupId = '', taskId = '', key) => (event) => {
    event.stopPropagation();
    const { value, name } = event.target;
    if ((name === 'newTitle' || name === 'newDesc') && value) {
      const newState = updateTaskValue(state, groupId, taskId, key, value);
      setState(newState);
    }
  }

  useEffect(() => {
    if (!task?.title && titleRef.current) {
      titleRef.current.focus();
    }
  }, [title, titleRef.current]);

  return (
  <Modal show onClose={onClose}>
    {!title ? (
      <div className={`${s.wrapper} ${s.titleInput}`}>
        <input
          ref={titleRef}
          name="newTitle"
          placeholder="Untitled"
          autoComplete="off"
          onBlur={handleInput(groupId, task?.id, 'title')}
        />
      </div>
    ) : (<h1 className={s.title}>{title}</h1>)}
    {!description ? (
      <div className={`${s.wrapper} ${s.descriptionInput}`}>
        <input
          name="newDesc"
          placeholder="Start typing description..."
          autoComplete="off"
          onBlur={handleInput(groupId, task?.id, 'description')}
        />
      </div>
    ) : (<div className={s.modalBody}>{description}</div>)}
  </Modal>);
}

export default TaskModal;