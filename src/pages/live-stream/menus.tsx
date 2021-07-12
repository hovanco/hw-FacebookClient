import React, { ReactElement } from 'react';
import { OrderedListOutlined, PlusCircleOutlined } from '@ant-design/icons';

export interface Menu {
    path: string;
    title: string;
    icon: ReactElement;
}

const menus = (path: string): Menu[] => [
    {
        path: `${path}/scripts`,
        title: 'Danh sách kịch bản livestream',
        icon: <OrderedListOutlined />,
    },
    {
        path: `${path}/new`,
        title: 'Thêm kịch bản',
        icon: <PlusCircleOutlined />,
    },
];

export default menus;
