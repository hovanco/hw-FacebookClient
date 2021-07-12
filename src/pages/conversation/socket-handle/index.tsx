import get from 'lodash/get';
import moment from 'moment';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';

import { NOTIFICATION_SERVER_URI } from '../../../configs/vars';
import { IAuthState } from '../../../reducers/authState/authReducer';
import {
    updateConversation,
    updateCountUnreadPage,
    updateUnreadForConversation,
} from '../../../reducers/fanpageState/fanpageAction';
import { IFacebookState } from '../../../reducers/fanpageState/fanpageReducer';
import { useNotification } from '../../customer/notfication-context';
import { checkToken } from '../../../api/token';
import authApi from '../../../api/auth-api';
import store from '../../../store';
import authTypes from '../../../reducers/authState/authTypes';
import { usePageVisibility } from '../../../hooks/usePageVisibility';
import { ConversationType } from '../../../collections/facebook-conversation';
import logo from '../../../assets/logo-fb.png';

interface State {
    auth: IAuthState;
    fanpage: IFacebookState;
}

interface IMessage {
    mid: string;
    text: string;
}

const SocketHandle: FC = (): JSX.Element => {
    const isActiveTabPage = usePageVisibility();
    const { play } = useNotification();
    const dispatch = useDispatch();
    const selectAuth = (state: State) => state.auth;
    const auth = useSelector(selectAuth);
    const accessToken: string = get(auth, 'token.accessToken');

    let [socket, setSocket] = useState<any>(null);

    const handelSetAccessToken = (token: string) => {
        socket = io(`${NOTIFICATION_SERVER_URI}/?token=${token}`, {
            path: '/socket',
            transports: ['websocket', 'polling'],
        });
        setSocket(socket);
    };

    const getAccessToken = async () => {
        try {
            const isValidAccessToken = checkToken(accessToken);
            if (!isValidAccessToken) {
                const refreshToken = get(auth, 'token.refreshToken');
                const isValidRefreshToken = checkToken(refreshToken);

                if (!isValidRefreshToken) {
                    return new Error('Refresh token expired');
                }

                const accessTokenNew = await authApi.refreshAccessToken(refreshToken);

                store.dispatch({
                    type: authTypes.UPDATE_TOKEN,
                    payload: accessToken,
                });

                return accessTokenNew;
            }
            return accessToken;
        } catch (error) {
            return error;
        }
    };

    const pushNotification = (
        type: ConversationType,
        value: { name: string; text: string },
        conversation: any,
    ) => {
        if (!isActiveTabPage && localStorage.getItem('isAllowPushNotify') === 'true') {
            if (Notification.permission === 'granted') {
                let notification;

                const data = {
                    icon: logo,
                    body: `${value.name}: ${value.text}`,
                };

                switch (type) {
                    case ConversationType.Comment:
                        notification = new Notification('Bình luận mới', data);
                        notification.onclick = function () {
                            window.open(
                                `${window.location.origin}/customer/conversation?pageId=${conversation.fbPageId}&postId=${conversation.postId}&type=${ConversationType.Comment}`,
                            );
                        };
                        break;

                    case ConversationType.Message:
                        notification = new Notification('Tin nhắn mới', data);
                        notification.onclick = function () {
                            window.open(
                                `${window.location.origin}/customer/conversation?pageId=${conversation.fbPageId}&type=${ConversationType.Message}`,
                            );
                        };
                        break;
                    default:
                        break;
                }
            }
        }
    };

    useEffect(() => {
        if (accessToken) {
            if (socket) {
                socket.close();
            }
            getAccessToken().then(async (token) => {
                await handelSetAccessToken(token);
            });
        }

        return () => socket && socket.close();
    }, [accessToken]);

    useEffect(() => {
        if (socket) {
            socket.on('comment', (res: any) => {
                const { changes, conversation } = res.entry[0];
                if (conversation && changes) {
                    const { value } = changes[0];

                    const newCommentPush = {
                        name: get(value, 'from.name'),
                        text: value.message,
                    };

                    const newMessage: any = {
                        type: 2,
                        id: value.comment_id,
                        message: value.message,
                        from: value.from,
                    };

                    if (value.item === 'comment' && value.photo) {
                        newMessage.attachment = {
                            type: 'photo',
                            media: {
                                image: {
                                    src: value.photo,
                                },
                            },
                        };

                        if (!newCommentPush.text) {
                            newCommentPush.text = 'đã gửi một ảnh';
                        }
                    }

                    pushNotification(ConversationType.Comment, newCommentPush, conversation);

                    dispatch(
                        updateConversation({
                            conversation: {
                                ...conversation,
                                message: value.message,
                            },
                            newMessage,
                        }),
                    );

                    dispatch(updateUnreadForConversation(conversation));

                    // play sound
                    if (conversation.unread) {
                        play();
                    }
                }
            });

            socket.on('message', (res: any) => {
                const { conversation, messaging } = res.entry[0];
                const message: any = messaging[0].message;

                const newMessagePush = {
                    name: conversation.fbUsername,
                    text: message.text,
                };
                let countVideo = 0;
                let countImage = 0;

                const data =
                    message.attachments &&
                    message.attachments.map((a: any) => {
                        if (a.type === 'video') {
                            countVideo++;
                            return {
                                id: Date.now(),
                                video_data: {
                                    url: a.payload.url,
                                },
                                mime_type: 'video/mp4',
                            };
                        }

                        countImage++;
                        return {
                            id: Date.now(),
                            image_data: {
                                preview_url: a.payload.url,
                                url: a.payload.url,
                            },
                            mime_type: 'image/jpeg',
                        };
                    });

                if (!newMessagePush.text) {
                    if (countVideo > 0 && countImage > 0) {
                        newMessagePush.text = `đã gửi ${countVideo} file âm thanh và ${countImage} ảnh`;
                    } else if (countImage > 0) {
                        newMessagePush.text = `đã gửi ${countImage} ảnh`;
                    } else if (countVideo > 0) {
                        newMessagePush.text = `đã gửi ${countVideo} file âm thanh`;
                    }
                }

                const newMessage = {
                    type: 1,
                    create_time: moment(new Date()).format(),
                    id: message.mid,
                    message: message.text || '',
                    attachments: { data },
                    from: { id: messaging[0].sender.id },
                };

                pushNotification(ConversationType.Message, newMessagePush, conversation);

                dispatch(
                    updateConversation({
                        conversation: {
                            ...conversation,
                            message: message.text,
                        },
                        newMessage,
                    }),
                );

                dispatch(updateUnreadForConversation(conversation));

                // play sound
                if (conversation.unread) {
                    play();
                }
            });

            socket.on('error', (res: any) => {
                // action error
            });
        }

        localStorage.setItem('isAllowPushNotify', isActiveTabPage ? 'false' : 'true');
        if (isActiveTabPage) {
            window.localStorage.setItem('isOneActiveTab', 'true');
        }
    }, [socket, isActiveTabPage]);

    return <></>;
};

SocketHandle.propTypes = {};

export default SocketHandle;
