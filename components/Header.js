import s from '../styles/Header.module.css';

function Header () {
    return (
        <header className={`${s.header} ${s.underlined} ${s.underlinedReverse}`}>
            <h3>Notion's TaskBoard Clone assignment</h3>
        </header>
    );
}

export default Header;
