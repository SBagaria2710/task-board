import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

//Components
import Image from 'next/image';

// Icon
import CrossIcon from 'public/assets/icons/crossIcon.js';

//Hooks
import { useKeyPress, useOutsideClick } from "../hooks";

// Style
import s from "../styles/Modal.module.css";

function Modal({ show, onClose, children, modalClass, modalContentClass }) {
  const ref = useRef();
  useKeyPress('Escape', () => onClose());
  useOutsideClick(ref, () => onClose());
  const [isBrowser, setIsBrowser] = useState(false);

  const handleCloseClick = (e) => {
    e.preventDefault();
    if (onClose) {
      onClose();
    }
  };

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const modalContent = show ? (
    <div className={s.modalOverlay}>
      <div className={`${s.modal} ${modalClass}`} ref={ref}>
        <div className={s.modalHeader}>
          <div onClick={handleCloseClick}>
            <CrossIcon alt="Cross Icon" />
          </div>
        </div>
        <div className={`${s.modalContent} ${modalContentClass}`}>
          {children}
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