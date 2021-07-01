import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

//Components
import Image from 'next/image';

// Icon
import CrossIcon from 'public/assets/icons/cross.png';

//Hooks
import { useOutsideClick } from "../hooks";

// Style
import s from "../styles/Modal.module.css";

function Modal({ show, onClose, children, title }) {
  const ref = useRef();
  useOutsideClick(ref, () => onClose());
  const [isBrowser, setIsBrowser] = useState(false);
  
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleCloseClick = (e) => {
    e.preventDefault();
    if (onClose) {
      onClose();
    }
  };

  const modalContent = show ? (
    <div className={s.modalOverlay}>
      <div className={s.modal} ref={ref}>
        <div className={s.modalHeader}>
          <div onClick={handleCloseClick}>
            <Image src={CrossIcon} alt="Cross Icon" width={20} height={20} />
          </div>
        </div>
        <div className={s.modalContent}>
          {title && <h1 className={s.title}>{title}</h1>}
          <div className={s.modalBody}>{children}</div>
        </div>
      </div>
    </div>
  ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(
        modalContent, 
        document.getElementById("modal-root")
    );
  } else {
    return null;
  }
}

export default Modal;