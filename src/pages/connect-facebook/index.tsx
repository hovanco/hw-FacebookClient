import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import { Logo } from '../../components';
import { AuthLayout } from '../../layout';
import ConnectFacebookCard from './connect-facebook-card';

const ConnectFacebook: FC = (): JSX.Element => {
    return (
        <AuthLayout title='Kết nối fanpage'>
            <div className='auth-top'>
                <Logo type='dark' />
            </div>

            <ConnectFacebookCard />
            <div className='bottom-text'>
                <Link to='/signup'>Trở lại trang chủ</Link>
            </div>
        </AuthLayout>
    );
};

export default ConnectFacebook;
