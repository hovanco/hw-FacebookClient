import { ConfigProvider } from 'antd';
import vi_VN from 'antd/es/locale-provider/vi_VN';
import moment from 'moment';
import 'moment/locale/vi';
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import AppRouter from './app-router';
import { ApiRequests, ErrorBoundary, Loading } from './components';
import store, { persistor } from './store';

moment.locale('vi');

const env = process.env.NODE_ENV;

function App() {
    return (
        <ConfigProvider
            locale={vi_VN}
            getPopupContainer={(trigger) => trigger?.parentElement || document.body}
        >
            <Provider store={store}>
                <PersistGate loading={<Loading />} persistor={persistor}>
                    {env === 'development' ? (
                        <ErrorBoundary>
                            <AppRouter />
                        </ErrorBoundary>
                    ) : (
                        <AppRouter />
                    )}
                </PersistGate>
            </Provider>
        </ConfigProvider>
    );
}

export default ApiRequests(App);
