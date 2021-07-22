import React, { useEffect, useState } from 'react';

// Component
import Toggle from "./Toggle";

// Icon
import TaskBoardIcon from 'public/assets/icons/taskBoardIcon.js';

// Style
import s from '../styles/Header.module.css';
import { darkblue } from 'color-name';

function Header () {
    const [toggled, setToggled] = useState(false);
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
                    <li className={s.navItem}>About</li>
                    <li className={s.navItem}>Settings</li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
