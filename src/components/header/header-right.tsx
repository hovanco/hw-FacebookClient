import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { connect } from 'react-redux';

import HeaderRightAction from './header-right-action';
import Menu from './menu';

function HeaderRight({ isAuth }: any): JSX.Element {
    const renderContent = () => {
        if (isAuth) {
            return <HeaderRightAction />;
        }
        return (
            <>
                <Link to='/signup'>
                    <Button>Đăng ký</Button>
                </Link>

                <Link to='/login' style={{ marginLeft: 15 }}>
                    <Button type='primary'>Đăng nhập</Button>
                </Link>
            </>
        );
    };

    return (
        <div className='header-right'>
            <nav className='nav'>
                <Menu />
                {renderContent()}
            </nav>
        </div>
    );
}

const enhance = connect(({ auth }: any) => ({
    isAuth: auth.isAuth,
}));

export default enhance(HeaderRight);
