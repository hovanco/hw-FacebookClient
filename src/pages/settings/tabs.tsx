import { SettingOutlined } from '@ant-design/icons';
import React from 'react';
import { ChatGroupIcon, ChatIcon, TagIcon } from '../../assets/icon';
import Comment from './comment';
import ConversationLabel from './conversation-label';
import General from './general';
import QuickMessage from './quick-message';

interface Tab {
    key: string;
    title: string;
    icon: JSX.Element;
    component: JSX.Element;
}

const tabs: Tab[] = [
    {
        key: 'general',
        title: 'Cài đặt chung',
        icon: <SettingOutlined style={{ fontSize: 20 }} />,
        component: <General />,
    },
    {
        key: 'comment',
        title: 'Bình luận',
        icon: <ChatGroupIcon style={{ fontSize: 20 }} />,
        component: <Comment />,
    },
    {
        key: 'conversation_label',
        title: 'Nhãn hội thoại',
        icon: <TagIcon style={{ fontSize: 20 }} />,
        component: <ConversationLabel />,
    },
    {
        key: 'quick_message',
        title: 'Tin nhắn nhanh',
        icon: <ChatIcon style={{ fontSize: 20 }} />,
        component: <QuickMessage />,
    },
    // {
    //     key: 'mobile_app',
    //     title: 'Ứng dụng mobile',
    //     icon: <AndroidOutlined />,
    //     component: <TabContent type="mobile_app" />,
    // },
];

export default tabs;
