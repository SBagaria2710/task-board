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

    let meta_pressed = false;

    const handleShortcut = (e) => {
        if ( e.key === 'Meta' || e.ctrlKey ) {
            meta_pressed = true;
        } else if (meta_pressed && e.key === 's') {
            e.preventDefault();
            handleSettingsModalToggle();
        } else if (meta_pressed && e.key === 'b') {
            e.preventDefault();
            handleAboutModalToggle();
        }
    }

    const resetMetaPressed = e => {
        if ( e.key === 'Meta' || e.ctrlKey ) {
            meta_pressed = false;
        }
    }

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
        const theme = localStorage.getItem('default-theme');
        try {
          if (theme) {
            document.body.dataset.theme = theme;
            if (theme === 'dark') handleToggle();
          }
        } catch(e) {
          console.error('ERROR: ', e);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleShortcut);
        window.addEventListener('keyup', resetMetaPressed);
        return () => {
            window.removeEventListener('keydown', handleShortcut);
            window.removeEventListener('keyup', resetMetaPressed);
        };
    }, []);

    return (
        <>
            {aboutModal && <AboutModal onClose={handleAboutModalToggle} />}
            {settingsModal && <SettingsModal onClose={handleSettingsModalToggle} />}
            <header className={s.header}>
                <div className={s.logo}>
                    <TaskBoardIcon alt="Logo Icon" />
                    <h3>TaskBoard</h3>
                </div>
                <nav className={s.navItems}>
                    <ul>
                        <li><Toggle toggled={toggled} onClick={handleToggle} /></li>
                        <li className={s.navItem} onClick={handleAboutModalToggle}>About</li>
                        <li className={s.navItem} onClick={handleSettingsModalToggle}>Settings</li>
                    </ul>
                </nav>
            </header>
        </>
    );
}

export default Header;
