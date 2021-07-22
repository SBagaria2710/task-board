import React from 'react';

// Components
import Modal from "../components/Modal";

// Styles
import s from "../styles/SettingsModal.module.css";

function SettingsModal({ onClose }) {
  return (
  <Modal show onClose={onClose} modalClass={s.test} modalContentClass={s.testAgain}>
    Hello! This is settings Modal
  </Modal>);
}

export default SettingsModal;
