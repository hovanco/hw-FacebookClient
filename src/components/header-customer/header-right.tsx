import { UserOutlined } from '@ant-design/icons';
import { Avatar, Col, Dropdown, Menu } from 'antd';
import { isNil } from 'lodash';
import React, { FC } from 'react';
import { connect, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useExpriedPackage } from '../../pages/customer/expried-package-context';
import { logout } from '../../reducers/authState/authAction';
import { connectFanpageAction } from '../../reducers/fanpageState/fanpageAction';
import BannerNotifyPackageTrial from '../banner-notify-package';
import BannerNotifyPackage from '../banner-notify-package/banner-package';
import './header-right.less';
import rectangle from './images/rectangle-4-copy.png';
interface Props {
    isAuth: boolean;
    user: any;
    pages: any;
    loadingPages: any;
    logout: any;
    connectFanpageAction: any;
    title?: string;
    children?: any | null;
}

const HeaderRight: FC<Props> = ({
    isAuth,
    user = {},
    pages = {},
    loadingPages,
    logout,
    connectFanpageAction,
    title,
    children,
}): JSX.Element => {
    let menu: Array<any> = [];
    const store = useSelector((state: any) => state.store.store);
    const userName = useSelector((state: any) => state.auth.user);
   
    const {
        isExpired,
        isTrial,
        handleCloseBannerTrial,
        handleCloseBannerFacebook,
        expiredPackage,
        listNamePackage,
        expiredTrial,
    } = useExpriedPackage();

    if (isAuth) {
        menu.push(
            {
                name: 'Trang quản lý',
                link: '/customer/conversation',
            },
            {
                name: 'Chọn lại trang',
                link: '/customer/select-pages',
            },
            {
                name: 'Đăng xuất',
                link: '/login',
                action: () => logout(),
            },
        );
        if (store.role >= 1) {
            menu = menu.filter((item) => item.link !== '/customer/select-pages');
        }
    } else {
        menu.push({
            name: 'Đăng nhập',
            link: '/login',
        });
    }

    const menuDropdown = (
        <Menu>
            {menu.map((item, key) => (
                <Menu.Item key={key.toString()} onClick={item.action && item.action}>
                    <Link to={item.link}>{item.name}</Link>
                </Menu.Item>
            ))}
        </Menu>
    );

    return (
        <>
            <div>
                <Col>
                    {isTrial && (
                        <BannerNotifyPackageTrial
                            expiredAtPackage={expiredTrial}
                            isExpired={isTrial}
                            handleCloseBanner={handleCloseBannerTrial}
                        />
                    )}
                    {isExpired && (
                        <BannerNotifyPackage
                            expired={expiredPackage}
                            isExpired={isExpired}
                            handleCloseBanner={handleCloseBannerFacebook}
                            namePackage={
                                listNamePackage?.length > 0 ? listNamePackage?.join(' ,') : ''
                            }
                        />
                    )}
                </Col>
            </div>
            <div className='header-right'>
                {!isNil(title) ? <div className='title'>{title}</div> : children}
                <Dropdown
                    overlayClassName='dropdown-active'
                    overlay={menuDropdown}
                    trigger={['click']}
                    placement='bottomRight'
                >
                    <div className='user-dropdown'>
                        <div className="infor-user ">
                            <span className='store-user'>{store.name}</span>
                            <span className='name-user'>{userName.name}</span>
                        </div>
                        <Avatar
                            className='avatar'
                            icon={<UserOutlined />}
                            size={43}
                            src={user.picture}
                        />
                    </div>
                </Dropdown>
            </div>
        </>
    );
};

const enhance = connect(
    ({ auth, fanpage }: any) => ({
        isAuth: auth.isAuth,
        user: auth.user,
        pages: fanpage.pages,
        loadingPages: fanpage.loading,
    }),
    { logout, connectFanpageAction },
);

export default enhance(HeaderRight);
