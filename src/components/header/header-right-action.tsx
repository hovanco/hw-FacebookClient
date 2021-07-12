import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

import { logout } from '../../reducers/authState/authAction';
import Media from 'react-media';

interface IProps {
    user: {
        type: string;
        name: string;
        displayName: string;
        picture: string;
    };
    logout: any;
}

const HeaderUserActions = ({ user, logout }: IProps) => {
    const history = useHistory();

    if (!user) {
        return null;
    }

    const onClickLogout = () => {
        logout();
        history.push({
            pathname: '/login',
            state: {
                from: history.location,
                guest: true,
            },
        });
    };

    const menu = (
        <Menu>
            {user.name && (
                <Menu.Item>
                    <b>{user.name}</b>
                </Menu.Item>
            )}

            {user.name && <Menu.Divider />}

            <Menu.Item key='3' onClick={onClickLogout}>
                Đăng xuất
            </Menu.Item>
        </Menu>
    );

    const to = user.type === 'admin' ? '/admin/overview' : '/customer/conversation';

    return (
        <Media queries={{ small: '(max-width: 767px)' }}>
            {(matches) => {
                const color = matches.small ? '#1890ff' : '#fff';
                const fontSize = matches.small ? 'inherit' : 18;
                const fontWeight = matches.small ? 400 : 500;

                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Link to={to} style={{ color, fontSize, fontWeight }}>
                            Vào trang quản trị
                        </Link>
                        <Dropdown overlay={menu} trigger={['click']} placement='bottomRight'>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    marginLeft: 10,
                                }}
                            >
                                <Avatar icon={<UserOutlined />} src={user.picture} />
                                <DownOutlined style={{ fontSize: 12, marginLeft: 5, color }} />
                            </div>
                        </Dropdown>
                    </div>
                );
            }}
        </Media>
    );
};

const enhance = connect(
    ({ auth }: any) => ({
        user: auth.user,
    }),
    { logout }
);

export default enhance(HeaderUserActions);
