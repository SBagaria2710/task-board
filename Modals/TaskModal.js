import React, { useEffect, useRef } from 'react';

// Components
import Modal from "../components/Modal";

// Utils
import { updateTaskValue, getTaskObj } from 'public/utils';

// Styles
import s from "../styles/TaskModal.module.css";

function TaskModal({ onClose, meta, state, setState }) {
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const { taskId, groupId } = meta;
  const taskObj = getTaskObj(state, groupId, taskId);
  const { title, description } = taskObj;

  const handleInput = (groupId = '', taskId = '', key) => (event) => {
    event.stopPropagation();
    const { value, name } = event.target;
    if ((name === 'newTitle' || name === 'newDesc') && value) {
      const newState = updateTaskValue(state, groupId, taskId, key, value);
      setState(newState);
    }
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
    {!title ? (
      <div className={`${s.wrapper} ${s.titleInput}`}>
        <input
          ref={titleRef}
          name="newTitle"
          placeholder="Untitled"
          autoComplete="off"
          onBlur={handleInput(groupId, taskId, 'title')}
        />
      </div>
    ) : (
    <h1 className={s.title}>{title}</h1>
    )}
    {!description ? (
      <div className={`${s.wrapper} ${s.descriptionInput}`}>
        <input
          ref={descriptionRef}
          name="newDesc"
          placeholder="Start typing description..."
          autoComplete="off"
          onBlur={handleInput(groupId, taskId, 'description')}
        />
      </div>
    ) : (<div className={s.modalBody}>{description}</div>)}
  </Modal>);
}

export default TaskModal;



// For contentEditable in h1 tag for onBlur event
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
