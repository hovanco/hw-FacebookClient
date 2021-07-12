import { Col, Input, message, Modal, Row, Space, Tooltip } from 'antd';
import { findLast, get, isObject } from 'lodash';
import moment from 'moment';
import React, { FC, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    loadConversation,
    loadMessages,
    sendPrivateReply,
    sendReply,
} from '../../../api/conversation-api';
import { ChatIcon, SendIcon } from '../../../assets/icon';
import { Loading } from '../../../components';
import useModal from '../../../hooks/use-modal';
import { IAuthState } from '../../../reducers/authState/authReducer';
import { IConversation, IFacebookState } from '../../../reducers/fanpageState/fanpageReducer';
import { IStoreState } from '../../../reducers/storeState/storeReducer';
import { Comment, Message, useConversationDetail } from './context';
import MessageBubble from './message-bubble';
import ModalAnswers from './modal-answers';
import ModelEmoji from './modal-emoji';
import QuickmessageList from './quick-message-list';

interface Props {
    name: string;
    comment: Comment;
}

const formatMessages = ({ arr, type }: { arr: any[]; type: number }): any =>
    arr.map((item: any) => ({ ...item, type }));

const ModalChat: FC<Props> = ({ name, comment }): JSX.Element => {
    const [messages, setMessage] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const { visible, toggle } = useModal();
    const [disabled, setDisabled] = useState(true);
    const [show, setShow] = useState(false);
    const messagesEndRef = useRef<any>(null);
    const inputRefModal = useRef<any>();

    const conversation: IConversation = useSelector(
        ({ fanpage }: { fanpage: IFacebookState }) => fanpage.conversation
    );

    const page: any = useSelector(({ fanpage }: { fanpage: IFacebookState }) => fanpage.page);

    const originSocketMessage: any = useSelector(
        ({ fanpage }: { fanpage: IFacebookState }) => fanpage.originSocketMessage
    );

    const store = useSelector(({ store }: { store: IStoreState }) => store.store);

    const token: any = useSelector(({ auth }: { auth: IAuthState }) => auth.token);

    const { textChat, changeTextChat } = useConversationDetail();
    const toggleShowQuick = () => setShow(!show);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView(false);
        }
    };

    useEffect(() => {
        if (
            originSocketMessage &&
            originSocketMessage.type === 1 &&
            get(originSocketMessage, 'from.id') === get(comment, 'from.id')
        ) {
            setMessage([...messages, originSocketMessage]);
        }
    }, [originSocketMessage]);

    useEffect(() => {
        const newDate = moment(new Date());
        let createDate = moment(comment.created_time);
        if (messages.length === 0 && newDate.diff(createDate, 'days', true) <= 1) {
            return setDisabled(false);
        }

        if (messages.length > 0) {
            const message = findLast(messages, (o) => o.from.id !== page.fbObjectId);
            if (isObject(message)) {
                createDate = moment(message.created_time);

                if (newDate.diff(createDate, 'days', true) <= 1) {
                    return setDisabled(false);
                }
            }
        }

        setDisabled(true);
    }, [messages]);

    useEffect(() => {
        if (visible) {
            const fetchData = async () => {
                const responses = await loadConversation({
                    storeId: store._id,
                    token: token.accessToken,
                    fbPageIds: [conversation.fbPageId],
                    query: `type=1&fbUserId=${comment.from.id}`,
                });
                if (responses.data.length > 0) {
                    const dataMessage = await loadMessages({
                        storeId: store._id,
                        token: token.accessToken,
                        fbPageId: conversation.fbPageId,
                        fbObjectId: responses.data[0].fbObjectId,
                    });
                    setMessage(
                        formatMessages({
                            arr: dataMessage.data,
                            type: 1,
                        }).reverse()
                    );
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [visible]);

    useLayoutEffect(() => scrollToBottom, [messages, loading]);

    useLayoutEffect(() => {
        if (inputRefModal.current) {
            inputRefModal.current.focus();
        }
    }, [textChat]);

    const renderMessages = () => {
        if (loading) return <Loading full />;

        return messages.map((message: any) => {
            return (
                <MessageBubble
                    me={message.from.id === conversation.fbPageId}
                    userId={comment.from.id}
                    type={1}
                    message={message}
                    key={message.id}
                />
            );
        });
    };

    const handlePrivateReply = () => {
        sendPrivateReply({
            storeId: store._id,
            fbPageId: conversation.fbPageId,
            token: token.accessToken,
            commentId: comment.id,
            text: textChat,
        })
            .then((res: any) => {
                const newMessages = [...messages];
                newMessages.push({
                    from: {
                        name: page.name,
                        email: '',
                        id: conversation.fbPageId,
                    },
                    id: conversation.fbPageId,
                    created_time: `${new Date()}`,
                    type: 2,
                    message: textChat,
                });
                setMessage(newMessages);
            })
            .catch((error) => {
                message.error('Đã có lỗi xảy ra!');
            });
    };

    const handleKeyPress = () => {
        sendReply({
            text: textChat,
            fbPageId: conversation.fbPageId,
            token: token.accessToken,
            storeId: store._id,
            id: conversation.fbUserId,
            type: 1,
            fbObjectId: conversation.fbObjectId,
        })
            .then((res: any) => {
                const message: Message = {
                    from: {
                        email: '',
                        id: conversation.fbPageId,
                        name: page.name,
                    },
                    id: conversation.fbPageId,
                    created_time: `${new Date()}`,
                    type: 1,
                    message: textChat,
                };
                const newMessages = [...messages];
                newMessages.push(message);
                setMessage(newMessages);
            })
            .catch((error) => {
                message.error('Đã có lỗi xảy ra!');
            });
    };

    const sendMessage = (isValid: any) => {
        if (show) {
            return toggleShowQuick();
        }

        if (isValid) {
            changeTextChat('');
            if (messages.length > 0) {
                return handleKeyPress();
            }
            return handlePrivateReply();
        }
        return null;
    };

    const handleSendMessage = () => {
        const isValid = !show && textChat.trim();
        sendMessage(isValid);
    };

    const handleEnterMessage = (e: any) => {
        const isValid = e.shiftKey !== true && e.key === 'Enter';

        sendMessage(isValid && !show && textChat.trim());
    };

    const onChangeText = (e: any) => {
        if (e.target.value.length === 0) {
            setShow(false);
        }
        if (e.target.value[0] === '/') {
            setShow(true);
        }

        if (show) {
            changeTextChat((e.target.value as string).trim());
        } else {
            changeTextChat(e.target.value as string);
        }
    };

    const handleCancel = () => {
        changeTextChat('');
        toggle();
    };

    const placeholder = () => {
        if (messages.length > 0) {
            const message = findLast(messages, (o) => o.from.id !== page.fbObjectId);
            if (!isObject(message)) {
                return 'Bạn chỉ có thể tiếp tục nhắn tin sau khi nhận được phản hồi của khách hàng';
            }
        }

        return disabled
            ? 'Bạn chỉ có thể phản hồi tin nhắn của khách hàng trong vòng 24h'
            : 'Viết tin nhắn....(Enter để gửi tin và Shift + Enter để xuống hàng)';
    };

    return (
        <>
            <Tooltip placement='top' title='Nhắn tin'>
                <div onClick={toggle} className='bubble_action-item'>
                    <ChatIcon />
                </div>
            </Tooltip>
            <Modal
                title={`Nhắn tin đến: ${name}`}
                visible={visible}
                onCancel={handleCancel}
                onOk={toggle}
                footer={null}
                bodyStyle={{ padding: '0' }}
            >
                <div className='conversation-detail conversation-detail-modal'>
                    <div className='conversation-detail-list conversation-detail-list-modal'>
                        {renderMessages()}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                <div className='conversation-detail-action'>
                    <div className='action-bottom'>
                        <Space>
                            <ModalAnswers chat={true} />
                        </Space>
                    </div>
                    <div className='box-reply'>
                        {show && (
                            <QuickmessageList
                                chat={true}
                                toggle={toggleShowQuick}
                                textFilter={textChat}
                            />
                        )}

                        <Row align='middle' gutter={10}>
                            <Col style={{ flex: 1 }}>
                                <div className='wrap-input'>
                                    <Input
                                        ref={inputRefModal}
                                        autoFocus
                                        onChange={onChangeText}
                                        onKeyPress={handleEnterMessage}
                                        className='input'
                                        value={textChat}
                                        disabled={loading || disabled}
                                        placeholder={placeholder()}
                                    />
                                    <div className='emoji-btn'>
                                        <ModelEmoji chat={true} />
                                    </div>
                                </div>
                            </Col>
                            <Col>
                                <span
                                    className={
                                        textChat.length === 0 ? 'send-btn disable' : 'send-btn'
                                    }
                                >
                                    <SendIcon
                                        style={{ fontSize: 20 }}
                                        onClick={textChat.length === 0 ? null : handleSendMessage}
                                    />
                                </span>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ModalChat;
