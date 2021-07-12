import React, { FC } from 'react';
import { Link, useRouteMatch, NavLink } from 'react-router-dom';

import SidebarItem from './sidebar-item';
import { menu, SidebarItemType } from './sidebar-menu';

const Sidebar: FC = (): JSX.Element => {
    const { path } = useRouteMatch();
    return (
        <>
            {menu(path).map((item: SidebarItemType) => (
                <NavLink
                    to={item.path}
                    key={item.path}
                    className='sidebar-item'
                    activeClassName='active'
                >
                    <SidebarItem key={item.title} menu={item} />
                </NavLink>
            ))}
        </>
    );
};

export default Sidebar;
