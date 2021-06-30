import Link from 'next/link';
import Image from 'next/image';

// Icon
import TaskBoardIcon from 'public/assets/icons/task-board.png';

// Style
import s from '../styles/Header.module.css';

function Header () {
    return (
        <header className={`${s.header} ${s.underlined} ${s.underlinedReverse}`}>
            <Image src={TaskBoardIcon} alt="TaskBoard Logo" width={26} height={26} /> 
            <h3>TaskBoard <span>(Inspired from <Link href="https://www.notion.so/projects" target="_blank">Notion</Link>)</span></h3>
        </header>
    );
}

export default Header;
