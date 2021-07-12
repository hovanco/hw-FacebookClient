import { SettingFilled } from '@ant-design/icons';
import { Col, Row } from 'antd';
import { filter } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { IConversation, IFacebookState } from '../../../reducers/fanpageState/fanpageReducer';
import { QuickMessageInterface } from '../../../reducers/setting/interfaces';
import { IState as SettingState } from '../../../reducers/setting/settingReducer';
import { useConversationDetail } from './context';
import QuickMessageItem from './quick-message-item';

interface Props {
    toggle: () => void;
    textFilter?: string;
    chat?: boolean;
}

const QuickmessageList: FC<Props> = ({ toggle, textFilter = '', chat = false }): JSX.Element => {
    const { changeText, changeTextChat } = useConversationDetail();
    const [index, setIndex] = useState(0);

    const quickMessage = useSelector(
        ({ setting }: { setting: SettingState }) => setting.quickMessage
    );

    const conversation: IConversation = useSelector(
        ({ fanpage }: { fanpage: IFacebookState }) => fanpage.conversation
    );

    const quickMessageArr = Object.keys(quickMessage).map((key: string) => ({
        ...quickMessage[key],
    }));

    const handMoveSelect = React.useCallback(
        (e) => {
            const leng_answers = quickMessageArr.length;

            if (e.code === 'ArrowDown') {
                if (index === leng_answers - 1) return null;
                return setIndex(index + 1);
            }

            if (e.code === 'ArrowUp') {
                if (index === 0) return null;
                return setIndex(index - 1);
            }

            if (e.code === 'Enter') {
                const answer = messages[index];
                if (answer) {
                    if (!chat) {
                        changeText('');
                        let message = (answer.message as string).trim();

                        if (conversation.type === 2) {
                            message = message.replace(
                                /{FULL_NAME}/gi,
                                `{${conversation.fbUsername || ''}}`
                            );
                        } else {
                            message = message.replace(
                                /{FULL_NAME}/gi,
                                conversation.fbUsername || ''
                            );
                        }

                        return changeText(message);
                    } else {
                        changeTextChat('');
                        return changeTextChat(
                            (answer.message as string)
                                .trim()
                                .replace(/{FULL_NAME}/gi, conversation.fbUsername || '')
                        );
                    }
                } else {
                    toggle();
                    if (!chat) {
                        return changeText(`${textFilter}`);
                    } else {
                        return changeTextChat(`${textFilter}`);
                    }
                }
            }

            return null;
        },
        [index, quickMessage]
    );

    useEffect(() => {
        document.addEventListener('keydown', handMoveSelect);

        return () => {
            document.removeEventListener('keydown', handMoveSelect);
        };
    }, [handMoveSelect]);

    const messages = filter(quickMessage, (message: QuickMessageInterface) =>
        (message.shortcut as string).includes(textFilter.substring(1))
    );

    return (
        <div className='quick-messages'>
            <Row align='middle' justify='space-between' style={{ background: '#eee', padding: 10 }}>
                <Col>Sử dụng ↑ hoặc ↓ để di chuyển [enter để chọn]</Col>
                <Col>
                    <Link to='/customer/other/setting'>
                        <SettingFilled /> Cài đặt
                    </Link>
                </Col>
            </Row>
            {messages.map((message: QuickMessageInterface, i: number) => {
                return (
                    <QuickMessageItem
                        chat={chat}
                        active={index === i}
                        key={message._id}
                        message={message}
                        toggleModal={toggle}
                        conversation={conversation}
                        fbUsername={conversation.fbUsername}
                    />
                );
            })}
        </div>
    );
};

export default QuickmessageList;
