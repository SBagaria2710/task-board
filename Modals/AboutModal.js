import React from 'react';

// Components
import Modal from "../components/Modal";

// Constants
import { socialLink } from 'public/constants';

// Styles
import s from "../styles/AboutModal.module.css";

function AboutModal({ onClose }) {
  return (
  <Modal show onClose={onClose} modalClass={s.modalClass} modalContentClass={s.modalContentClass}>
    <div className={s.wrapper}>
      <div className={s.container}>
        <div className={s.version}>v1.0.0</div>
        <div className={s.about}>About</div>
        <div>Task board for managing task status.</div>
      </div>
      <div className={s.socialLinkContainer}>
        <a href={socialLink.linkedIn} target="_blank">LinkedIn</a>
        <a href={socialLink.twitter} target="_blank">Twitter</a>
        <a href={socialLink.github} target="_blank">Github</a>
        <a href={socialLink.codepen} target="_blank">CodePen</a>
      </div>
    </div>
  </Modal>);
}

export default AboutModal;
