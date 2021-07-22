import React from "react";

// Style
import s from '../styles/Toggle.module.css';

export default function Toggle({ toggled, onClick }) {
    return (
        <div onClick={onClick} className={`${s.toggle} ${toggled && s.night}`}>
            <div className={s.notch}>
                <div className={s.crater} />
                <div className={s.crater} />
            </div>
            <div>
                <div className={`${s.shape} ${s.sm}`} />
                <div className={`${s.shape} ${s.sm}`} />
                <div className={`${s.shape} ${s.md}`} />
                <div className={`${s.shape} ${s.lg}`} />
            </div>
        </div>
    );
}