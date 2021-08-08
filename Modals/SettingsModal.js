import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

// Components
import Modal from "../components/Modal";
import Tooltip from "../components/Tooltip";

// Utils
import { getEmptyGroup } from 'public/utils';

// Constants
import { initialModalData } from 'public/constants';

// Styles
import s from "../styles/SettingsModal.module.css";

function SettingsModal({ onClose }) {
  const [activeTheme, setActiveTheme] = useState('dark');

  const setDefaultTheme = (event) => {
    event.stopPropagation();
    const { attributes } = event.target;
    const name = attributes.getNamedItem('name')?.value;
    setActiveTheme(name);
    localStorage.setItem('default-theme', name);
  };

  const resetBoard = () => {
    const stateData = localStorage.getItem('task-board-state');
    if (stateData) {
      const parsedState = JSON.parse(stateData);
      if(parsedState.length === 1 && !parsedState[0].tasks.length) {
        toast.error('🙅‍♂️ Nothing to reset');
      } else {
        localStorage.setItem('task-board-state', JSON.stringify([getEmptyGroup('No Status', false)]));
        localStorage.setItem('modal-state', JSON.stringify(initialModalData));
        location.reload();
      }
    }
  };

  useEffect(() => {
      document.body.dataset.theme = activeTheme === 'dark' ? 'dark' : 'light';
  }, [activeTheme]);

  // Data Persistance
  useEffect(() => {
    const defaultTheme = localStorage.getItem('default-theme');
    try {
      if (defaultTheme) {
        setActiveTheme(defaultTheme);
      }
    } catch(e) {
      console.error('ERROR: ', e);
    }
  }, []);

  return (
  <Modal show onClose={onClose} modalClass={s.modalClass} modalContentClass={s.modalContentClass}>
    <div className={s.container}>
      <div className={s.themeContainer}>
        <p className={s.title}>Default Theme</p>
        <p className={s.subtitle}>(sets theme from next reload onwards)</p>
        <div className={s.theme} onClick={setDefaultTheme}>
          <div name="light" className={`${s.lightTheme} ${activeTheme === 'light' && s.active}`} />
          <div name="dark" className={`${s.darkTheme} ${activeTheme === 'dark' && s.active}`} />
        </div>
      </div>
      <hr />
      <div className={s.resetBoard}>
        Reset Board? 
        <Tooltip tooltipText="Delete all tasks and groups" placement='top'>
          <button className={s.dangerBtn} onClick={resetBoard}>Click here 😱</button>
        </Tooltip>
      </div>
    </div>
  </Modal>);
}

export default SettingsModal;
