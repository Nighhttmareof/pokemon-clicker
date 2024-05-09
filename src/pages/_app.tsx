
import React from 'react';
import type { AppProps } from 'next/app';
import '../styles/global.css';
import { Provider } from 'react-redux';
import store from '@/redux/store/store';
import Global from '@/components/global';



const App = ({ Component, pageProps }: AppProps) => {
    const GlobalComponent = Global(Component);
    return (
        <Provider store={store}>
            <GlobalComponent {...pageProps} />
        </Provider>
    )
    
};

export default App;