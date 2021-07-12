import React, { ReactElement } from 'react';

import { TeamOutlined, UserOutlined, SettingOutlined, ClusterOutlined } from '@ant-design/icons';

export interface SidebarItemType {
    icon: ReactElement;
    title: string;
    active: string;
    path: string;
}

export const menu = (path: string): SidebarItemType[] => [
    {
        icon: <TeamOutlined />,
        title: 'Nhân viên',
        active: 'staff',
        path: `${path}/members`,
    },
    {
        icon: <UserOutlined />,
        title: 'Khách hàng',
        active: 'customer',
        path: `${path}/customer`,
    },
    {
        icon: <ClusterOutlined />,
        title: 'Chi nhánh',
        active: 'warehouse',
        path: `${path}/warehouse`,
    },
    {
        icon: <SettingOutlined />,
        title: 'Cài đặt',
        active: 'setting',
        path: `${path}/setting`,
    },
];
