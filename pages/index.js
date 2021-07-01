import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Components
import Header from '../components/Header';
// import Canvas from '../components/Canvas';
const Canvas = dynamic(import('../components/Canvas'));

// Styles
import s from '../styles/index.module.css';

function Index() {
    const [boardReady, setBoardReady] = useState(false);
    useEffect(() => {
        setBoardReady(true);
    }, []);
    return (
        <>
            <Header />
            <main className={s.main}>
                <section>
                    {boardReady ? <Canvas /> : null}
                </section>
            </main>
        </>
    );
};

export default Index;
