import { Layout, Menu } from 'antd';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import {
    BoxIcon,
    CameraIcon,
    CartIcon,
    ChartIcon,
    ChatGroupIcon,
    DoubleLeftIcon,
    DoubleRightIcon,
    OtherIcon,
    OrderDraftIcon,
} from '../../assets/icon';
import Logo from '../logo';
import { Scrollbars } from '../index';
import constants from '../../constants';

import './header.less';

const { Sider } = Layout;
const { SubMenu } = Menu;

interface MenuItem {
    path?: string;
    title: string;
    icon?: ReactElement;
    key: string;
    sub_menu?: boolean;
    hide?: boolean;
    parent?: string;
}

const initialCollapsed = (): boolean => {
    const collapsed_local = localStorage.getItem('collapsed_local');
    if (!collapsed_local) return false;

    return JSON.parse(collapsed_local);
};

const CustomerHeader: FC = (): JSX.Element => {
    const store = useSelector((state: any) => state.store.store);
    const location = useLocation();

    const [keys, setKeys] = useState<string[]>(['1']);
    const [collapsed, setCollapsed] = useState<boolean>(initialCollapsed());

    const menuSidebar: MenuItem[] = [
        {
            path: '/customer/conversation',
            title: 'Hội thoại',
            icon: <ChatGroupIcon className='icon' style={{ fontSize: 22 }} />,
            key: '1',
        },
        {
            path: '/customer/livestream',
            title: 'Bán hàng livestream',
            icon: <CameraIcon className='icon' style={{ fontSize: 15 }} />,
            key: '2',
            hide: !process.env.REACT_APP_SHOW_LIVESTREAM,
        },
        {
            title: 'Báo cáo',
            icon: <ChartIcon className='icon' style={{ fontSize: 22 }} />,
            key: '4',
            sub_menu: true,
            hide: !store || store.role >= 2,
        },
        { key: '4.1', parent: '4', title: 'Tương tác', path: '/customer/report/conversation' },
        { key: '4.2', parent: '4', title: 'Nhãn hội thoại', path: '/customer/report/label' },
        { key: '4.3', parent: '4', title: 'Doanh thu', path: '/customer/report/revenue' },
        {
            title: 'Cài đặt',
            path: '/customer/other/setting',
            icon: <OtherIcon className='icon' style={{ fontSize: 18 }} />,
            key: '5',
            hide: !store || store.role >= 2,
        },
        {
            title: 'Cửa hàng',
            icon: <CartIcon className='icon' />,
            key: 'core',
        },
    ];

    const convertUrlToKey = (url: string) => {
        if (url && url.indexOf('/customer/order/') !== -1) {
            return ['3'];
        }
        if (url && url.indexOf('/customer/livestream') !== -1) {
            return ['2'];
        }

        switch (url) {
            case '/customer/conversation':
                return ['1'];
            case '/customer/livestream/scripts':
                return ['2'];
            case '/customer/other/warehouse':
                return ['3'];
            case '/customer/report/conversation':
                return ['4', '4.1'];
            case '/customer/report/label':
                return ['4', '4.2'];
            case '/customer/report/revenue':
                return ['4', '4.3'];
            case '/customer/other/setting':
                return ['5'];
            default:
                return ['0'];
        }
    };

    useEffect(() => {
        setKeys(convertUrlToKey(location.pathname));
    }, [location]);

    const onSelect = ({ _, key }: any) => {
        setKeys(key);
    };

    const onCollapse = (value: boolean) => {
        localStorage.setItem('collapsed_local', JSON.stringify(value));
        setCollapsed(value);
    };

    return (
        <Layout className='header-customer'>
            <Sider
                trigger={collapsed ? <DoubleRightIcon /> : <DoubleLeftIcon />}
                className='sidebar'
                width={250}
                collapsible
                collapsed={collapsed}
                onCollapse={onCollapse}
                style={{
                    overflow: 'inherit',
                }}
            >
                <div className={collapsed ? 'logo collapsed' : 'logo'}>
                    <Logo type='light' short={collapsed} />
                </div>

                <Scrollbars
                    style={{ width: 250 }}
                    renderThumbVertical={(props: any) => (
                        <div {...props} className='thumb-vertical' />
                    )}
                >
                    <Menu selectedKeys={keys} mode='inline' onSelect={onSelect}>
                        {menuSidebar.map((menu: MenuItem) => {
                            if (menu.parent) return null;
                            if (menu.hide) return null;
                            if (menu.sub_menu) {
                                const menu_childs = menuSidebar.filter(
                                    (item) => item.parent === menu.key
                                );
                                return (
                                    <SubMenu
                                        key={menu.key}
                                        icon={menu.icon}
                                        title={menu.title}
                                        popupClassName='header-customer-sub'
                                    >
                                        {menu_childs.map((item: any) => (
                                            <Menu.Item key={item.key}>
                                                <Link to={item.path}>{item.title}</Link>
                                            </Menu.Item>
                                        ))}
                                    </SubMenu>
                                );
                            }

                            return (
                                <Menu.Item key={menu.key}>
                                    { menu.key !== 'core' ?
                                        <Link to={menu.path as string}>
                                            {menu.icon}

                                            <span>{menu.title}</span>
                                        </Link> :
                                        <Link
                                            to={location => location.pathname}
                                            onClick={() => window.open(constants.URL_STORE, '_blank')}
                                        >
                                            {menu.icon}

                                            <span>{menu.title}</span>
                                        </Link>
                                    }
                                </Menu.Item>
                            );
                        })}
                    </Menu>
                </Scrollbars>
            </Sider>
        </Layout>
    );
};

export default CustomerHeader;
