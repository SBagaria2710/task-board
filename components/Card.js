import Image from 'next/image';

// Icon
import DeleteIcon from 'public/assets/icons/delete-icon.png';

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
      <Image src={DeleteIcon} alt="Delete Icon" width={20} height={20} />
    </button>
  </div>
);

export default Card;
