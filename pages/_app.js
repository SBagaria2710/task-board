import Head from 'next/head';
// import Document, { Html, Head, Main, NextScript } from 'next/document'

// Styles
import '../styles/styles.css';

function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>TaskBoard</title>
                <link rel="project-logo" href="../public/assets/icons/task-board.png" />
            </Head>
            <div>
                <Component {...pageProps} />
                <div id="modal-root" />
            </div>
        </>
    );
}

export default App;