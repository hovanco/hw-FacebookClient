import { Col, Input, message, Row } from 'antd';
import { findLast, get, isObject } from 'lodash';
import moment from 'moment';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendReply } from '../../../api/conversation-api';
import { SendIcon } from '../../../assets/icon';
import { IAuthState } from '../../../reducers/authState/authReducer';
import { IConversation, IFacebookState } from '../../../reducers/fanpageState/fanpageReducer';
import { IStoreState } from '../../../reducers/storeState/storeReducer';
import { useConversationDetail } from './context';
import ModalEmoji from './modal-emoji';
import QuickmessageList from './quick-message-list';

interface Props {
    privateReply?: boolean;
    handlePrivateReply?: (text: string) => void;
    disabled?: boolean;
}

const BoxReply: FC<Props> = ({
    privateReply = false,
    handlePrivateReply,
    disabled = false,
}): JSX.Element => {
    const dispatch = useDispatch();
    const inputRef = useRef<any>(null);
    const [show, setShow] = useState(false);
    const [data, setData] = useState<any | null>(null);
    const {
        text,
        changeText,
        isFocus,
        messages,
        setIdMessage,
        changeIsFocus,
        removeMessageError,
        setMessageSending,
    } = useConversationDetail();

    const conversation: IConversation = useSelector(
        ({ fanpage }: { fanpage: IFacebookState }) => fanpage.conversation
    );
    const page: { fbObjectId: string; name: string } = useSelector(
        ({ fanpage }: { fanpage: any }) => fanpage.page
    );

    const store = useSelector(({ store }: { store: IStoreState }) => store.store);

    const token: any = useSelector(({ auth }: { auth: IAuthState }) => auth.token);

    const toggle = () => setShow(!show);

    useEffect(() => {
        if (data) {
            setIdMessage(data);
            setData(null);
        }
    }, [data]);

    const handleKeyPress = async (e: any) => {
        const isValid = e.shiftKey !== true && e.key === 'Enter';

        if (show) {
            return toggle();
        }

        if (isValid && !show && text.trim()) {
            e.preventDefault();

            const regex = new RegExp(`{${conversation.fbUsername}}`, 'g');

            let convertText = text;
            if (conversation.type === 2) {
                convertText = (text || '').replace(regex, conversation.fbUsername || '');
            }

            const fakeId = Date.now();

            const message_sending = {
                create_time: moment(new Date()).format(),
                message: convertText,
                from: {
                    name: page.name,
                    email: '',
                    id: page.fbObjectId,
                },
                id: fakeId,
            };

            changeText('');
            setMessageSending(message_sending);

            if (privateReply && handlePrivateReply) {
                handlePrivateReply(text);
            } else {
                convertText = text;
                if (conversation.type === 2) {
                    convertText = (text || '').replace(regex, `@[${conversation.fbUserId}]`);
                }

                try {
                    const res = await sendReply({
                        text: convertText,
                        fbPageId: conversation.fbPageId,
                        token: token.accessToken,
                        storeId: store._id,
                        id: conversation.fbUserId,
                        type: conversation.type,
                        fbObjectId: conversation.fbObjectId,
                    });
                    if (res) {
                        setData({
                            realId: get(res, '[1].data.id') || get(res, '[1].data.message_id'),
                            fakeId,
                        });
                    }
                } catch (e) {
                    message.error('Đã xảy ra lỗi');
                    removeMessageError(message_sending);
                }
            }
        }

        return null;
    };

    const onChangeText = (e: any) => {
        if (e.target.value.length === 0) {
            setShow(false);
        }
        if (e.target.value[0] === '/') {
            setShow(true);
        }

        if (show) {
            changeText((e.target.value as string).trim());
        } else {
            changeText(e.target.value as string);
        }
    };

    const onBlur = () => {
        changeIsFocus(false);
    };

    const sendMessage = () => {
        if (!show && text.trim()) {
            const regex = new RegExp(`{${conversation.fbUsername}}`, 'g');

            let convertText = text;
            if (conversation.type === 2) {
                convertText = (text || '').replace(regex, conversation.fbUsername || '');
            }

            const fakeId = Date.now();

            const message_sending = {
                create_time: moment(new Date()).format(),
                message: convertText,
                from: {
                    name: page.name,
                    email: '',
                    id: page.fbObjectId,
                },
                id: fakeId,
            };

            changeText('');
            setMessageSending(message_sending);

            if (privateReply && handlePrivateReply) {
                handlePrivateReply(text);
            } else {
                convertText = text;
                if (conversation.type === 2) {
                    convertText = (text || '').replace(regex, `@[${conversation.fbUserId}]`);
                }

                sendReply({
                    text: convertText,
                    fbPageId: conversation.fbPageId,
                    token: token.accessToken,
                    storeId: store._id,
                    id: conversation.fbUserId,
                    type: conversation.type,
                    fbObjectId: conversation.fbObjectId,
                })
                    .then((res: any) => {
                        if (res) {
                            setData({
                                realId: get(res, '[1].data.id') || get(res, '[1].data.message_id'),
                                fakeId,
                            });
                        }
                    })
                    .catch((error) => {
                        message.error('Đã xảy ra lỗi');
                        removeMessageError(message_sending);
                    });
            }
        }

        return null;
    };

    useEffect(() => {
        inputRef.current.focus();
    }, [text]);

    useEffect(() => {
        inputRef.current.focus();
    }, [isFocus]);

    return (
        <div className='box-reply'>
            {show && <QuickmessageList toggle={toggle} textFilter={text} />}

            <Row align='middle' justify='space-between' gutter={10}>
                <Col style={{ flex: 1 }}>
                    <div className='wrap-input'>
                        <Input
                            ref={inputRef}
                            onBlur={onBlur}
                            autoFocus
                            onChange={onChangeText}
                            onKeyPress={handleKeyPress}
                            disabled={disabled}
                            className='input'
                            value={text}
                            placeholder={
                                disabled
                                    ? 'Bạn chỉ có thể phản hồi tin nhắn của khách hàng trong vòng 24h'
                                    : 'Viết tin nhắn. (Enter để gửi tin và Shift + Enter để xuống hàng)'
                            }
                        />
                        {!disabled && (
                            <div className='emoji-btn'>
                                <ModalEmoji />
                            </div>
                        )}
                    </div>
                </Col>

                <Col style={{ lineHeight: 1 }}>
                    <SendIcon
                        className={text.length === 0 ? 'send-btn disable' : 'send-btn'}
                        style={{ fontSize: 20 }}
                        onClick={text.length === 0 ? null : sendMessage}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default BoxReply;
