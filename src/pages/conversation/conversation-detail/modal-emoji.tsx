import { SmileOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import { Picker } from 'emoji-mart';
import React, { FC } from 'react';
import useModal from '../../../hooks/use-modal';
import { useConversationDetail } from './context';
import './modal-emoji.less';

interface Props {
    chat?: boolean;
    disabled?: boolean;
}

const Emoji: FC<Props> = ({ chat = false, disabled = false }): JSX.Element => {
    const { toggle, visible } = useModal();

    const { changeText, text, textChat, changeTextChat } = useConversationDetail();

    const addEmoji = (e: any) => {
        if (!chat) {
            changeText(`${text}${e.native}`);
        } else {
            changeTextChat(`${textChat}${e.native}`);
        }

        toggle();
    };
    return (
        <Popover
            content={<Picker onSelect={addEmoji} />}
            trigger='click'
            visible={visible}
            onVisibleChange={toggle}
            placement='top'
        >
            <div
                onClick={!disabled ? toggle : undefined}
                className={`item${disabled ? ' item-disabled' : ''}`}
            >
                <SmileOutlined />
            </div>
        </Popover>
    );
};

export default Emoji;
