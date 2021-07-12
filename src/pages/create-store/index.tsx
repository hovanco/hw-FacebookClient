import { Card } from 'antd';
import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import { Loading, Logo } from '../../components';
import { AuthLayout } from '../../layout';
import CreateStoreForm from './create-store-form';
import './style.less';

const CreateStore: FC = (): JSX.Element => {
    const store = useSelector((state: any) => state.store.store);

    const [loadingConnect, setLoadingConnect] = useState(false);

    const toggleLoading = (value: boolean) => {
        setLoadingConnect(value);
    };

    if (loadingConnect)
        return (
            <div className='create-store-wrap'>
                <div>
                    <Loading />
                    <div className='title_loading'>Đang cài đặt, vui lòng chờ</div>
                </div>
            </div>
        );

    if (store) {
        return <Redirect to='/customer' />;
    }

    return (
        <AuthLayout title='Tạo cửa hàng'>
            <div className='auth-top'>
                <Logo type='dark' />
            </div>
            <Card className='create-store-card'>
                <h3 className='title-form'>Tạo cửa hàng</h3>
                <CreateStoreForm toggleLoading={toggleLoading} />
            </Card>
            <div className='bottom-text'>
                <Link to='/signup'>Trở lại trang chủ</Link>
            </div>
        </AuthLayout>
    );
};

export default CreateStore;
