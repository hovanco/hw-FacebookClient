import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { FC, useState } from 'react';
import { Link as LinkMenu } from 'react-router-dom';
import { Link } from 'react-scroll';
import Logo from '../logo';
import IconMenu from './icon-menu';
import { MenuChildType, menus } from './menu';
import { useSelector } from 'react-redux';
import HeaderRightAction from './header-right-action';

const HeaderMobile: FC = (): JSX.Element => {
    const isAuth = useSelector((state: any) => state.auth.isAuth);
    const [show, setShow] = useState<boolean>(false);
    const toggle = (): void => setShow(!show);

    return (
        <>
            {show && <div className='gray' onClick={toggle} />}

            <div className='header-container'>
                <Logo type='light' style={{ height: 40 }} />
                <IconMenu onClick={toggle} show={show} />

                <div className='menu-mobile' style={{ left: show ? 0 : '-80%' }}>
                    <div className='close-menu' onClick={toggle}>
                        <CloseOutlined style={{ marginRight: 15 }} />
                        <span>Đóng</span>
                    </div>
                    <ul>
                        {menus.map((menu: MenuChildType) => (
                            <li className='menu-item' key={menu.href}>
                                <Link to={menu.href} spy smooth duration={500} offset={-82}>
                                    {menu.title}
                                </Link>
                            </li>
                        ))}

                        {isAuth ? (
                            <li className='menu-item'>
                                <HeaderRightAction />
                            </li>
                        ) : (
                            <li className='menu-item group-btn'>
                                <LinkMenu to='/signup'>
                                    <Button block>Đăng ký</Button>
                                </LinkMenu>

                                <LinkMenu to='/login' style={{ marginLeft: 15 }}>
                                    <Button type='primary' block>
                                        Đăng nhập
                                    </Button>
                                </LinkMenu>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default HeaderMobile;
