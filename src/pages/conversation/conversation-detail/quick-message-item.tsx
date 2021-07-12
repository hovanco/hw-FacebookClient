import { Tag } from 'antd';
import React, { FC, memo } from 'react';

import { QuickMessageInterface } from '../../../reducers/setting/interfaces';
import { useConversationDetail } from './context';
import './quick-message-item.less';

interface Props {
    message: QuickMessageInterface;
    toggleModal: () => void;
    active?: boolean;
    chat?: boolean;
    fbUsername?: string;
    conversation: any;
}

const QuickMessageItem: FC<Props> = ({
    message,
    toggleModal,
    active = false,
    chat = false,
    fbUsername = '',
    conversation,
}): JSX.Element => {
    const { changeText, changeTextChat } = useConversationDetail();
    const selectQuickMessage = () => {
        if (!chat) {
            let convetMessage = (message.message as string).trim();

            if (conversation.type === 2) {
                convetMessage = convetMessage.replace(
                    /{FULL_NAME}/gi,
                    `{${conversation.fbUsername || ''}}`
                );
            } else {
                convetMessage = convetMessage.replace(
                    /{FULL_NAME}/gi,
                    conversation.fbUsername || ''
                );
            }
            changeText(convetMessage);
        } else {
            changeTextChat((message.message as string).trim().replace(/{FULL_NAME}/gi, fbUsername));
        }
        toggleModal();
    };

    const className = active ? 'quick-message-item active' : 'quick-message-item';

    return (
        <div className={className} onClick={selectQuickMessage}>
            /{message.shortcut}{' '}
            <Tag color={message.backgroundColor} style={{ color: message.color }}>
                {message.title}
            </Tag>{' '}
            {message.message}
        </div>
    );
};

export default memo(QuickMessageItem);
