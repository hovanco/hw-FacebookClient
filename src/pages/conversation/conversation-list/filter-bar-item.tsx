import { Tooltip } from 'antd';
import React, { FC, memo } from 'react';

interface Props {
    menu: any;
    selected?: string[];
    onClick?: (action: string, active: string) => void;
}

const FilterBarItem: FC<Props> = ({ menu, selected, onClick }): JSX.Element => {
    const handleOnClick = (active: string) => {
        if (selected && selected.includes(active)) {
            onClick && onClick('delete', active);
        } else {
            onClick && onClick('add', active);
        }
    };

    return (
        <div
            className={
                selected && selected.includes(menu.active)
                    ? 'filter-bar-item active'
                    : 'filter-bar-item'
            }
            onClick={(e) => handleOnClick(menu.active)}
        >
            <Tooltip 
                title={menu.title} 
                overlayInnerStyle={{ whiteSpace: 'nowrap' }}
            >
                <span>{menu.icon}</span>
            </Tooltip>
        </div>
    );
};

export default memo(FilterBarItem);
