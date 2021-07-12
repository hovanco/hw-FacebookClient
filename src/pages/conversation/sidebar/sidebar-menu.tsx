import React, { ReactElement } from 'react';

import {
    HomeOutlined,
    MessageOutlined,
    MailOutlined,
    EyeInvisibleOutlined,
    PhoneOutlined,
    MobileOutlined,
    ShakeOutlined,
} from '@ant-design/icons';

export interface SidebarItemType {
    icon: ReactElement;
    title: string;
    active: string;
}

const parent: SidebarItemType[] = [
    // { icon: 'sync', title: 'Bỏ lọc', handle: () => {} },
    {
        icon: <HomeOutlined />,
        title: 'Tất cả hội thoại',
        active: 'all',
    },
    {
        icon: <MessageOutlined />,
        title: 'Bình luận',
        active: 'comment',
    },
    { icon: <MailOutlined />, title: 'Tin nhắn', active: 'message' },
];

const chidlren: SidebarItemType[] = [
    {
        icon: <EyeInvisibleOutlined />,
        title: 'Tin chưa đọc',
        active: 'not_read',
    },
    {
        icon: <PhoneOutlined />,
        title: 'Tìm có số điện thoại',
        active: 'has_phone',
    },
    {
        icon: <MobileOutlined />,
        title: 'Tìm không có số điện thoại',
        active: 'not_phone',
    },
    {
        icon: <ShakeOutlined />,
        title: 'Tìm chưa trả lời',
        active: 'not_answer',
    },
    // {
    //   icon: 'table',
    //   title: 'Tìm theo thời gian',
    //   active: 'time'
    // },
    // {
    //   icon: 'tag',
    //   title: 'Tìm theo nhãn hội thoại',
    //   active: 'label'
    // },
    // {
    //   icon: 'file-text',
    //   title: 'Tìm theo id bài viết',
    //   active: 'id'
    // }
];

export default {
    parent,
    chidlren,
};
