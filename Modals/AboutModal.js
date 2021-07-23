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
        <h1>Hey 👋</h1>
        <div className={s.about}>v1.0.0</div>
        <p>Manage your daily todos with this kanban style task board!</p>
      </div>
      <div>
        <p style={{textAlign: 'center'}}>Feel free to connect and drop a suggestion 👇</p>
        <div className={s.socialLinkContainer}>
          <a href={socialLink.linkedIn} target="_blank">LinkedIn</a>
          <a href={socialLink.twitter} target="_blank">Twitter</a>
          <a href={socialLink.github} target="_blank">Github</a>
          <a href={socialLink.codepen} target="_blank">CodePen</a>
        </div>
      </div>
    </div>
  </Modal>);
}

export default AboutModal;
