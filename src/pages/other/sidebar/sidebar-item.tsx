import React, { FC, ReactElement } from 'react';
import { Tooltip } from 'antd';

import { SidebarItemType } from './sidebar-menu';

interface Props {
    menu: SidebarItemType;
    onClick?: () => void;
}

const SidebarItem: FC<Props> = ({ menu, onClick }): ReactElement => {
    return (
        <Tooltip placement='right' title={menu.title}>
            <div className='sidebar-item' onClick={onClick}>
                {menu.icon}
            </div>
        </Tooltip>
    );
};

export default SidebarItem;
