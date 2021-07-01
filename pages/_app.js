import Head from 'next/head';

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
                <div id="modal-root"></div>
            </div>
        </>
    );
}

export default App;