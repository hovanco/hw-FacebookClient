import React from 'react';
import { Link } from 'react-scroll';

import { MenuLeftStyle } from './style';

export const menus = [
    {
        title: 'Tính năng',
        href: 'tinh_nang',
    },
    {
        title: 'Bảng giá',
        href: 'bang_gia',
    },
    {
        title: 'Quản lý bán hàng',
        href: 'quan_ly_ban_hang',
    },
];

export interface MenuChildType {
    href: string;
    title: string;
}

const Menu = () => {
    return (
        <ul className='main-menu'>
            {menus.map((c: MenuChildType) => (
                <li key={c.href}>
                    <Link to={c.href} spy smooth duration={500} offset={0}>
                        {c.title}
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default Menu;
