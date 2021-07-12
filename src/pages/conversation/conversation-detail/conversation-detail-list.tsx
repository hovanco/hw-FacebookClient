import { Button, Space } from 'antd';
import { isArray, pick } from 'lodash';
import React, { FC, ReactElement, useEffect, useLayoutEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useDispatch, useSelector } from 'react-redux';
import { loadComments, loadMessages } from '../../../api/conversation-api';
import { Loading } from '../../../components';
import { IAuthState } from '../../../reducers/authState/authReducer';
import { setNewMessage } from '../../../reducers/fanpageState/fanpageAction';
import { IConversation, IFacebookState } from '../../../reducers/fanpageState/fanpageReducer';
import { IStoreState } from '../../../reducers/storeState/storeReducer';
import { Comment, Message, useConversationDetail } from './context';
import MessageBubble from './message-bubble';

type Item = Comment | Message;

interface Props {
    contentPost: any;
    loadingContent: boolean;
    updateContentPost: () => void;
    filterConversation: () => void;
}

const ConversationDetailList: FC<Props> = ({
    contentPost,
    loadingContent,
    updateContentPost,
    filterConversation,
}): ReactElement => {
    const conversation: IConversation = useSelector(
        ({ fanpage }: { fanpage: IFacebookState }) => fanpage.conversation
    );
    const newMessage: any = useSelector(
        ({ fanpage }: { fanpage: IFacebookState }) => fanpage.newMessage
    );
    const isUpdateMessage: boolean = useSelector(
        ({ fanpage }: { fanpage: IFacebookState }) => fanpage.isUpdateMessage
    );

    const dispatch = useDispatch();

    const token: any = useSelector(({ auth }: { auth: IAuthState }) => auth.token);
    const store = useSelector(({ store }: { store: IStoreState }) => store.store);

    const {
        isNewMessage,
        setIsNewMessage,
        next,
        loading,
        messages,
        updateMessage,
        loadMoreMessages,
    } = useConversationDetail();

    const messagesEndRef = useRef<any>(null);

    const scrollToBottom = () => {
        if (!loading) {
            messagesEndRef.current.scrollIntoView(false);
        }
    };

    useLayoutEffect(() => {
        if (isNewMessage) {
            scrollToBottom();
            setIsNewMessage(false);
        }
    }, [isNewMessage]);

    useEffect(() => {
        if (newMessage && isUpdateMessage) {
            updateMessage(newMessage);
            dispatch(setNewMessage(null));
        }
    }, [newMessage, isNewMessage]);

    const getInnerHeight = (elm: HTMLElement) => {
        if (elm) {
            const computed = getComputedStyle(elm);
            const padding = parseInt(computed.paddingTop) + parseInt(computed.paddingBottom);

            return elm.clientHeight - padding;
        }

        return 0;
    };

    useLayoutEffect(() => {
        const elmBoxChat = document.getElementById('list-chat');
        let isScroll = false;

        if (elmBoxChat) {
            const height = getInnerHeight(elmBoxChat);
            isScroll = elmBoxChat.scrollHeight - (elmBoxChat.scrollTop + height) < 500;
        }

        if ((isArray(messages) && messages.length <= 20) || isScroll) {
            scrollToBottom();
        }
    }, [messages]);

    const renderMessages = () => {
        if (loading) return <Loading full />;
        return messages.map((message: any, index: number) => {
            return (
                <MessageBubble
                    me={message.from.id === conversation.fbPageId}
                    userId={conversation.fbUserId}
                    type={conversation.type}
                    message={message}
                    key={message.id + index}
                    isShowAvatarHere={
                        index === 0 || message.from.id !== messages[index - 1].from.id
                    }
                />
            );
        });
    };

    const renderButton = () => {
        if (loading) return;

        return (
            conversation.type === 2 && (
                <div style={{ marginBottom: 30 }}>
                    <Space size={10} direction='vertical'>
                        <div className='post-content'>
                            {contentPost.full_picture && (
                                <div
                                    className={
                                        contentPost.message ? 'img-post has-content' : 'img-post'
                                    }
                                >
                                    <img src={contentPost.full_picture} alt='' />
                                </div>
                            )}

                            {contentPost.message && (
                                <div className='text'>
                                    <div style={{ padding: '10px 15px' }}>
                                        {contentPost.message}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div>
                            {/* <Button
                            type="primary"
                            size="small"
                            loading={loadingContent}
                            onClick={() => updateContentPost()}
                        >
                            Cập nhật lại nội dung bài viết
                        </Button>
                        &nbsp; */}
                            <Button onClick={() => filterConversation()}>
                                Lọc bình luận của bài viết này
                            </Button>
                        </div>
                    </Space>
                </div>
            )
        );
    };

    const loadMore = async () => {
        try {
            let res: any = { data: [] };
            if (conversation.type === 1 && !loading && next) {
                res = await loadMessages({
                    ...pick(conversation, ['fbObjectId', 'fbPageId']),
                    storeId: store._id,
                    token: token.accessToken,
                    next,
                });
                if (res && isArray(res.data)) {
                    loadMoreMessages(res.data, res.next);
                }
            } else if (conversation.type === 2 && !loading && next) {
                let conversationId = conversation.fbObjectId;
                res = await loadComments({
                    conversationId,
                    ...pick(conversation, ['fbPageId']),
                    storeId: store._id,
                    token: token.accessToken,
                    next,
                });
                if (res && isArray(res.data)) {
                    loadMoreMessages(res.data.reverse(), res.next);
                }
            }
        } catch (e) {}
    };

    return (
        <div id='list-chat' className='conversation-detail-list'>
            {renderButton()}

            <InfiniteScroll
                pageStart={0}
                loadMore={loadMore}
                hasMore={!!next}
                loader={<Loading />}
                useWindow={false}
                initialLoad={false}
                threshold={20}
                isReverse
            >
                {renderMessages()}
            </InfiniteScroll>
            {/* {renderMessagesSending()} */}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ConversationDetailList;
