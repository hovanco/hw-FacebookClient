import React, { FC, ReactElement } from 'react';
import { Tooltip } from 'antd';

import { SidebarItemType } from './sidebar-menu';

interface Props {
    menu: SidebarItemType;
    selected?: string[];
    onClick?: (action: string, active: string) => void;
}

const SidebarItem: FC<Props> = ({ menu, selected, onClick }): ReactElement => {
    const handleOnClick = (active: string) => {
        if (selected && selected.includes(active)) {
            onClick && onClick('delete', active);
        } else {
            onClick && onClick('add', active);
        }
    };

    return (
        <Tooltip placement='right' title={menu.title}>
            <div
                className={
                    selected && selected.includes(menu.active)
                        ? 'sidebar-item active'
                        : 'sidebar-item'
                }
                onClick={(e) => handleOnClick(menu.active)}
            >
                {menu.icon}
            </div>
        </Tooltip>
    );
};

export default SidebarItem;
