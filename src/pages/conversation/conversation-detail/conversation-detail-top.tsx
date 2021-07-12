import { EyeInvisibleOutlined } from '@ant-design/icons';
import { Avatar, Tooltip, Space } from 'antd';
import { find } from 'lodash';
import moment from 'moment';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { markAsUnreadApi } from '../../../api/conversation-api';
import { IAuthState } from '../../../reducers/authState/authReducer';
import {
    loadConversations,
    markAsUnread,
    removeConversations,
    updateCountUnreadPage,
} from '../../../reducers/fanpageState/fanpageAction';
import { IConversation, IFacebookState, Page } from '../../../reducers/fanpageState/fanpageReducer';
import { IStoreState } from '../../../reducers/storeState/storeReducer';
import ToggleBlockBtn from './toggle-block-btn';
import { MessageIcon, FacebookIcon, SearchIcon } from '../../../assets/icon';
import { generateUrlImgFb } from '../../../utils/generate-url-img-fb';

import './conversation-detail-top.less';

const ConversationDetailTop: FC = (): JSX.Element => {
    const [flag, setFlag] = useState<boolean>(false);
    const conversation: IConversation = useSelector(
        ({ fanpage }: { fanpage: IFacebookState }) => fanpage.conversation
    );
    const pages = useSelector(({ fanpage }: { fanpage: IFacebookState }) => fanpage.pages);
    const store = useSelector(({ store }: { store: IStoreState }) => store.store);
    const token: any = useSelector(({ auth }: { auth: IAuthState }) => auth.token);
    const page = find(pages, (page: Page) => page.fbObjectId === conversation.fbPageId);

    useEffect(() => {
        setFlag(false);
    }, [conversation]);

    const postId = conversation.postId ? conversation.postId.split('_')[1] : '';

    const dispatch = useDispatch();

    const handleFilterConversation = () => {
        dispatch(removeConversations());
        let fbPageId;
        if (store.activePage) {
            fbPageId = store.activePage.fbObjectId;
        }
        const query = store.queryConversation
            ? `${store.queryConversation}&fbUserId=${conversation.fbUserId}`
            : `fbUserId=${conversation.fbUserId}`;
        dispatch(loadConversations(query, [fbPageId]));
    };

    const handleMarkAsUnread = () => {
        if (!flag || !conversation.unread) {
            markAsUnreadApi({
                storeId: store._id,
                fbPageId: conversation.fbPageId,
                token: token.accessToken,
                conversationId: conversation.fbObjectId,
                read: false,
            }).then((res: any) => {
                dispatch(
                    updateCountUnreadPage({
                        fbObjectId: store.activePage.fbObjectId,
                    })
                );
                dispatch(markAsUnread({ conversation, unread: true }));
                setFlag(true);
            });
        }
    };

    return (
        <div className='conversation-detail-top'>
            <div className='left'>
                <div className='avatar'>
                    <Avatar
                        alt={conversation.fbUsername}
                        src={generateUrlImgFb(conversation.fbUserId, page.accessToken)}
                        size={30}
                    />

                    <span className='icon'>
                        {conversation.type === 1 ? <MessageIcon /> : <FacebookIcon />}
                    </span>
                </div>

                <div className='info'>
                    <div className='name'>{conversation.fbUsername}</div>
                    <span className='date'>
                        {moment(conversation.updatedAt).format('DD-MM-YYYY HH:mm')}
                    </span>
                </div>
            </div>
            <div className='right'>
                <div className='action'>
                    <span className='item'>
                        <Tooltip placement='bottom' title='Tất cả hội thoại của khách này'>
                            <SearchIcon onClick={handleFilterConversation} />
                        </Tooltip>
                    </span>

                    <span className='item'>
                        <ToggleBlockBtn />
                    </span>

                    <span className='item'>
                        <Tooltip placement='bottom' title='Đánh dấu chưa đọc'>
                            <EyeInvisibleOutlined onClick={handleMarkAsUnread} disabled={flag} />
                        </Tooltip>
                    </span>
                </div>

                {page && (
                    <div className='avatar-fb'>
                        <Space align='center' size={15}>
                            <a href={page.link} target='_blank'>
                                <Tooltip placement='bottom' title={page.name}>
                                    <Avatar
                                        src={generateUrlImgFb(page.fbObjectId, page.accessToken)}
                                        alt={page.name}
                                        size={38}
                                    />
                                </Tooltip>
                            </a>

                            {conversation.type === 2 && (
                                <a href={`${page && page.link}/posts/${postId}`} target='_blank'>
                                    <Tooltip placement='bottom' title='Xem trên facebook'>
                                        <FacebookIcon style={{ fontSize: 25 }} />
                                    </Tooltip>
                                </a>
                            )}
                        </Space>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConversationDetailTop;
