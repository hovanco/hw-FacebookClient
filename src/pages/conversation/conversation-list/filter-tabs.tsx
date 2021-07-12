import React, { FC, ReactElement } from 'react';
import { CopyIcon, FacebookIcon, MessageIcon } from '../../../assets/icon';
import { TextEllipsis } from '../../../components';

interface Tab {
    icon: ReactElement;
    title: string;
    active: string;
}

const tabs: Tab[] = [
    {
        icon: <CopyIcon style={{ fontSize: 18, color: '#0872d7' }} />,
        title: 'Tất cả',
        active: 'all',
    },

    {
        icon: <MessageIcon style={{ fontSize: 18 }} />,
        title: 'Tin nhắn',
        active: 'message',
    },
    {
        icon: <FacebookIcon style={{ fontSize: 18 }} />,

        title: 'Bình luận',
        active: 'comment',
    },
];

interface FilterTabItemProps {
    tab: Tab;
    onClick: (active: string) => void;
    active?: boolean;
}

const FilterTabItem: FC<FilterTabItemProps> = ({ tab, onClick, active = false }) => {
    const handleOnClick = () => {
        onClick(tab.active);
    };

    const className = active ? 'filter-tab-item active' : 'filter-tab-item';

    return (
        <div onClick={handleOnClick} className={className}>
            <TextEllipsis>
                {tab.icon} {tab.title}
            </TextEllipsis>
        </div>
    );
};

interface Props {
    selected: string[];
    onClick: (action: string, active: string) => void;
}

const FilterTabs: FC<Props> = ({ selected, onClick }) => {
    const handleOnClick = (active: string) => {
        if (selected && selected.includes(active)) {
            onClick && onClick('delete', active);
        } else {
            onClick && onClick('add', active);
        }
    };

    const isHasSelectTab = tabs.filter((tab: Tab) => {
        return selected && selected.includes(tab.active);
    });

    return (
        <div className='filter-tabs'>
            {tabs.map((tab: Tab) => {
                const active = selected && selected.includes(tab.active);
                return (
                    <FilterTabItem
                        key={tab.title}
                        onClick={handleOnClick}
                        tab={tab}
                        active={(isHasSelectTab.length === 0 && tab.active === 'all') || active}
                    />
                );
            })}
        </div>
    );
};

export default FilterTabs;
