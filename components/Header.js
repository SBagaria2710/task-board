import Link from 'next/link';
import Image from 'next/image';

// Icon
import TaskBoardIcon from 'public/assets/icons/task-board.png';

// Style
import s from '../styles/Header.module.css';

function Header () {
    return (
        <header className={s.header}>
            <div className={s.logo}>
                <Image src={TaskBoardIcon} alt="TaskBoard Logo" width={26} height={26} /> 
                <h3>TaskBoard</h3>
            </div>
            <nav className={s.navItems}>
                <ul>
                    <li className={s.navItem}>About</li>
                    <li className={s.navItem}>Settings</li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
