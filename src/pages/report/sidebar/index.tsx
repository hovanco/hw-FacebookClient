import React, { FC } from 'react';
import { Tooltip } from 'antd';
import { NavLink, useRouteMatch } from 'react-router-dom';

import menus, { Menu } from './menus';

const Sidebar: FC = (): JSX.Element => {
    const { path } = useRouteMatch();
    return (
        <div className='sidebar'>
            {menus(path).map(
                (menu: Menu): JSX.Element => (
                    <NavLink
                        to={menu.path}
                        key={menu.path}
                        className='sidebar-item'
                        activeClassName='active'
                    >
                        <Tooltip placement='right' title={menu.title}>
                            {menu.icon}
                        </Tooltip>
                    </NavLink>
                )
            )}
        </div>
    );
};

export default Sidebar;
