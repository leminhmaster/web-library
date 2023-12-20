import '../styles/globals.css';
import {ConfigProvider} from 'antd';
import 'antd/dist/antd.css';
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
                        <title>Hệ thống quản lý thư viện</title>
                        <link rel="icon" href="http://localhost:3000/library-book-svgrepo-com.svg"/>
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