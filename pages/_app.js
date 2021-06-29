import Head from 'next/head';

// Styles
import '../styles/styles.css';

function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>Notion's TaskBoard Clone assignment</title>
            </Head>
            <div>
                <Component {...pageProps} />
                <div id="modal-root"></div>
            </div>
        </>
    );
}

export default App;