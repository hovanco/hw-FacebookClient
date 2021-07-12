import { Empty } from 'antd';
import querystring from 'querystring';
import React, { FC, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Loading } from '../../../components';
import {
    loadConversations,
    removeConversations,
} from '../../../reducers/fanpageState/fanpageAction';
import { IConversation, IFacebookState } from '../../../reducers/fanpageState/fanpageReducer';
import { IStoreState } from '../../../reducers/storeState/storeReducer';
import ConversationFilter from './conversation-filter';
import ConversationItem from './conversation-item';

import './style.less';

const CoversationList: FC = (): JSX.Element => {
    let location = useLocation();
    const loading = useSelector(
        ({ fanpage }: { fanpage: IFacebookState }) => fanpage.loading_conversation
    );

    const conversations = useSelector(
        ({ fanpage }: { fanpage: IFacebookState }) => fanpage.conversations
    );

    const next = useSelector(({ fanpage }: { fanpage: IFacebookState }) => fanpage.next);

    const store = useSelector(({ store }: { store: IStoreState }) => store.store);

    const pages = useSelector(({ fanpage }: { fanpage: IFacebookState }) => fanpage.pages);
    const arrPage = Object.keys(pages).map((key: string) => pages[key]);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(removeConversations());

        const query = querystring.parse(location.search.substring(1));

        if ((!query.pageId || !query.postId) && !query.type) {
            if (store.activePage) {
                dispatch(loadConversations(undefined, [store.activePage.fbObjectId]));
            } else {
                dispatch(loadConversations(undefined, [arrPage[0].fbObjectId]));
            }
        }
    }, []);

    const loadMore = () => {
        if (!loading && next) {
            dispatch(loadConversations(undefined, [store.activePage.fbObjectId], undefined, next));
        }
    };

    const renderConversation = () => {
        if (conversations.length === 0 && !loading) {
            return <Empty imageStyle={{ marginTop: '10px' }} description='Không có hội thoại' />;
        }

        return (
            <InfiniteScroll
                loadMore={loadMore}
                hasMore={!!next}
                initialLoad={false}
                useWindow={false}
                threshold={20}
                isReverse={false}
            >
                {conversations.map((conversation: IConversation) => {
                    return <ConversationItem conversation={conversation} key={conversation._id} />;
                })}
                {loading && <Loading />}
            </InfiniteScroll>
        );
    };

    return (
        <div className='conversation-list'>
            <div className='conversation-list-top'>
                <ConversationFilter />
            </div>

            <div className='conversation-items'>{renderConversation()}</div>
        </div>
    );
};

export default CoversationList;
