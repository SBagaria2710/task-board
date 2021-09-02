import React, { useEffect, useState, useRef } from "react";

// Components
import Modal from "../components/Modal";
import toast from "react-hot-toast";

// Icon
import DeleteIcon from "public/assets/icons/deleteIcon.js";

// Utils
import { updateTaskValue, getTaskObj } from "public/utils";

// Styles
import s from "../styles/TaskModal.module.css";

function TaskModal({ state, setState, meta, onClose, handleDeleteTask }) {
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const { taskId, groupId } = meta;
  const taskObj = getTaskObj(state, groupId, taskId);
  const { title, description } = taskObj;

  const handleInput =
    (groupId = "", taskId = "", key) =>
    (event) => {
      event.stopPropagation();
      const { value, name } = event.target;
      if ((name === "newTitle" || name === "newDesc") && value) {
        const newState = updateTaskValue(state, groupId, taskId, key, value);
        setState(newState);
        toast.success(
          `${name === "newTitle" ? "Title" : "Description"} added successfully`
        );
        if (!isUpdated) setIsUpdated(true);
      }
    };

  const handleContentEditable =
    (groupId = "", taskId = "", key) =>
    (event) => {
      event.stopPropagation();
      const { textContent, attributes } = event.target;
      const name = attributes.getNamedItem("name")?.value;
      if ((name === "newTitle" || name === "newDesc") && textContent) {
        const newState = updateTaskValue(
          state,
          groupId,
          taskId,
          key,
          textContent
        );
        setState(newState);
        toast.success(
          `${
            name === "newTitle" ? "Title" : "Description"
          } updated successfully`
        );
        if (!isUpdated) setIsUpdated(true);
      }
    };

  const deleteTaskAndCloseModal = (event) => {
    handleDeleteTask(event);
    onClose();
  };

  useEffect(() => {
    if (!title) {
      setTimeout(() => titleRef.current.focus(), 0);
    } else if (!description) {
      setTimeout(() => descriptionRef.current.focus(), 0);
    }
  }, []);

  useEffect(() => {
    let timerId;
    if (isUpdated) {
      timerId = setTimeout(() => setIsUpdated(false), 2000);
    }
    return () => clearTimeout(timerId);
  }, [isUpdated]);

  return (
    <Modal show onClose={onClose}>
      <div className={s.actionContainer}>
        {isUpdated ? (
          <p className={s.actionStatus}>Updated 🤝</p>
        ) : (
          <p className={s.actionStatus}>
            <span>Note</span>: You can start editing the title/description right
            away.
          </p>
        )}
        <button
          onClick={(event) => deleteTaskAndCloseModal(event)}
          className={s.dangerBtn}
        >
          Delete Task
          <DeleteIcon />
        </button>
      </div>
      {!title ? (
        <div className={`${s.wrapper} ${s.titleInput}`}>
          <input
            ref={titleRef}
            name="newTitle"
            placeholder="Untitled"
            autoComplete="off"
            onBlur={handleInput(groupId, taskId, "title")}
          />
        </div>
      ) : (
        <h1
          name="newTitle"
          contentEditable
          suppressContentEditableWarning
          onBlur={handleContentEditable(groupId, taskId, "title")}
          className={s.title}
        >
          {title}
        </h1>
      )}
      {!description ? (
        <div className={`${s.wrapper} ${s.descriptionInput}`}>
          <input
            ref={descriptionRef}
            name="newDesc"
            placeholder="Start typing description..."
            autoComplete="off"
            onBlur={handleInput(groupId, taskId, "description")}
          />
        </div>
      ) : (
        <div
          name="newDesc"
          contentEditable
          suppressContentEditableWarning
          onBlur={handleContentEditable(groupId, taskId, "description")}
          className={s.modalBody}
        >
          {description}
        </div>
      )}
    </Modal>
  );
}

export default TaskModal;
