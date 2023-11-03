import '../styles/globals.css';
import {ConfigProvider} from 'antd';
import 'antd/dist/antd.css';
import {MainContext} from '../contexts/MainContext';
import AuthProvider from '../contexts/AuthContext';
import Head from 'next/head';
import AppLayout from '../components/AppLayout/AppLayout';
import {Provider} from "react-redux";
import store from "../store";

function App({Component, pageProps}) {
    // Thực hiện bất kỳ xử lý nào dành cho toàn bộ ứng dụng ở đây

    return (
        <ConfigProvider>
            <Provider store={store}>
                <AuthProvider>
                    <Head>
                        <title>Library Manager System</title>
                        <link rel="icon" href="/favicon.ico"/>
                    </Head>
                    <AppLayout>
                        <Component {...pageProps} />
                    </AppLayout>
                </AuthProvider>
            </Provider>
        </ConfigProvider>
    );
}

export default App;