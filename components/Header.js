import React, { useEffect, useState } from 'react';

// Component
import Toggle from "./Toggle";
import AboutModal from "../Modals/AboutModal";
import SettingsModal from "../Modals/SettingsModal";

// Icon
import TaskBoardIcon from 'public/assets/icons/taskBoardIcon.js';

// Style
import s from '../styles/Header.module.css';

function Header () {
    const [toggled, setToggled] = useState(false);
    const [settingsModal, setSettingsModal] = useState(false);
    const [aboutModal, setAboutModal] = useState(false);

    const handleAboutModalToggle = () => {
        setAboutModal((s) => !s);
    };

    const handleSettingsModalToggle = () => {
        setSettingsModal((s) => !s);
    };

    const handleToggle = () => {
        setToggled((s) => !s);
    };

    useEffect(() => {
        document.body.dataset.theme = toggled ? 'dark' : 'light';
    }, [toggled]);

    useEffect(() => {
        const themeData = localStorage.getItem('theme');
        try {
          if (themeData) {
            document.body.dataset.theme = JSON.parse(themeData);
          }
        } catch(e) {
          console.error('ERROR: ', e);
        }
      }, []);

    return (
        <>
            {!aboutModal && <AboutModal onClose={handleAboutModalToggle} />}
            {/* {settingsModal && <SettingsModal onClose={handleSettingsModalToggle} />} */}
            <header className={s.header}>
                <div className={s.logo}>
                    <TaskBoardIcon alt="Logo Icon" />
                    <h3>TaskBoard</h3>
                </div>
                <nav className={s.navItems}>
                    <ul>
                        <li>
                            <Toggle toggled={toggled} onClick={handleToggle} />
                        </li>
                        <li className={s.navItem} onClick={handleAboutModalToggle}>About</li>
                        <li className={s.navItem} onClick={handleSettingsModalToggle}>Settings</li>
                    </ul>
                </nav>
            </header>
        </>
    );
}

export default Header;
