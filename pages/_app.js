import '../styles/globals.css';
import { ConfigProvider } from 'antd';
import 'antd/dist/antd.css';
import { MainContext } from '../contexts/MainContext';
import Head from 'next/head';
import AppLayout from '../components/AppLayout/AppLayout';

function App({ Component, pageProps }) {
  // Thực hiện bất kỳ xử lý nào dành cho toàn bộ ứng dụng ở đây

  return (
    <ConfigProvider>
      <MainContext.Provider>
        <Head>
          <title>Library Manager System</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </MainContext.Provider>
    </ConfigProvider>
  );
}

export default App;