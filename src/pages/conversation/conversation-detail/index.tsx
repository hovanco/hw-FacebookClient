import 'emoji-mart/css/emoji-mart.css';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDetailPost } from '../../../api/conversation-api';
import { IAuthState } from '../../../reducers/authState/authReducer';
import {
    loadConversations,
    removeConversations,
} from '../../../reducers/fanpageState/fanpageAction';
import { IConversation, IFacebookState } from '../../../reducers/fanpageState/fanpageReducer';
import { IStoreState } from '../../../reducers/storeState/storeReducer';
import { useExpriedPackage } from '../../customer/expried-package-context';
import { ProviderContext } from './context';
import ConversationDetailAction from './conversation-detail-action';
import ConversationDetailList from './conversation-detail-list';
import ConversationDetailTop from './conversation-detail-top';
import Labels from './labels';

const ConversationDetail: FC = (): JSX.Element => {
    const { isExpired, isTrial } = useExpriedPackage();
    const [contentPost, setContentPost] = useState({});
    const [loadingContent, setLoadingContent] = useState(false);

    const conversation: IConversation = useSelector(
        ({ fanpage }: { fanpage: IFacebookState }) => fanpage.conversation,
    );

    const store = useSelector(({ store }: { store: IStoreState }) => store.store);

    const token: any = useSelector(({ auth }: { auth: IAuthState }) => auth.token);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!conversation) return;
        updateContentPost();
    }, [conversation]);

    if (!conversation) {
        return <div className='conversation-detail' />;
    }

    const updateContentPost = async () => {
        try {
            if (conversation.type === 2 && conversation.postId) {
                setLoadingContent(true);
                const result = await getDetailPost({
                    postId: conversation.postId,
                    fbPageId: conversation.fbPageId,
                    storeId: store._id,
                    token: token.accessToken,
                });
                setContentPost(result);
                setLoadingContent(false);
            }
        } catch (error) {
            setLoadingContent(false);
        }
    };

    const filterConversation = () => {
        if (conversation.type === 2 && conversation.postId) {
            let fbPageId;
            if (store.activePage) {
                fbPageId = store.activePage.fbObjectId;
            }
            dispatch(removeConversations());
            dispatch(loadConversations(`type=2&postId=${conversation.postId}`, [fbPageId]));
        }
    };

    const HEIGHT = `calc(100vh - ${isExpired || isTrial ? '140px' : '75px'}`;

    return (
        <ProviderContext>
            <div className='conversation-detail' style={{ height: HEIGHT }}>
                <ConversationDetailTop />
                <ConversationDetailList
                    loadingContent={loadingContent}
                    contentPost={contentPost}
                    updateContentPost={updateContentPost}
                    filterConversation={filterConversation}
                />

                <Labels />
                <ConversationDetailAction />
            </div>
        </ProviderContext>
    );
};
export default ConversationDetail;
