import React, { ReactElement } from 'react';
import { MessageOutlined, DollarOutlined, TagOutlined } from '@ant-design/icons';

export interface Menu {
    path: string;
    title: string;
    icon: ReactElement;
}

const menus = (path: string): Menu[] => [
    {
        path: `${path}/conversation`,
        title: 'Tương tác',
        icon: <MessageOutlined />,
    },
    {
        path: `${path}/label`,
        title: 'Nhãn hội thoại',
        icon: <TagOutlined />,
    },
    {
        path: `${path}/revenue`,
        title: 'Doanh thu',
        icon: <DollarOutlined />,
    },
];

export default menus;
