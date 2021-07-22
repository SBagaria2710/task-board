import Image from 'next/image';

// Icon
import DeleteIcon from 'public/assets/icons/deleteIcon.js';

// Style
import s from "../styles/Card.module.css";

const Card = ({ handleDeleteTask, children, onClick, task }) => (
  <div className={s.card} onClick={onClick} title={task?.title || ''}>
    {children}
    <button
      className={s.deleteBtn}
      type="button"
      onClick={(event) => handleDeleteTask(event)}
    >
      <DeleteIcon alt="Delete ICon" />
    </button>
  </div>
);

export default Card;
