import { LikeOutlined, LoadingOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React, { FC, useState, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { likeComment } from '../../../api/conversation-api';
import { IAuthState } from '../../../reducers/authState/authReducer';
import { updateLikeCommentsConversation } from '../../../reducers/fanpageState/fanpageAction';
import { IConversation, IFacebookState } from '../../../reducers/fanpageState/fanpageReducer';
import { IStoreState } from '../../../reducers/storeState/storeReducer';
import { Comment } from './context';

interface Props {
    comment: Comment;
    handleLike: () => void;
    liked: boolean;
}

const Like: FC<Props> = ({ comment, handleLike, liked }): JSX.Element => {
    const dispatch = useDispatch();
    const conversation: IConversation = useSelector(
        ({ fanpage }: { fanpage: IFacebookState }) => fanpage.conversation
    );
    const store = useSelector(({ store }: { store: IStoreState }) => store.store);

    const token: any = useSelector(({ auth }: { auth: IAuthState }) => auth.token);

    const [loading, setLoading] = useState(false);

    const toggleLike = async () => {
        setLoading(true);
        likeComment({
            commentId: comment.id,
            fbPageId: conversation.fbPageId,
            storeId: store._id,
            token: token.accessToken,
            data: {
                fbConversationId: conversation._id,
            },
        })
            .then(() => {
                setLoading(false);
                handleLike();
                dispatch(
                    updateLikeCommentsConversation({
                        conversationId: conversation._id,
                        commentId: comment.id,
                        value: !liked,
                    })
                );
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const title = liked ? 'Bỏ thích bình luận' : 'Thích bình luận';

    return (
        <Tooltip placement={liked ? 'right' : 'top'} title={title} overlayClassName='tooltip-like'>
            <div className='bubble_action-item'>
                {loading ? <LoadingOutlined /> : <LikeOutlined onClick={toggleLike} />}
            </div>
        </Tooltip>
    );
};

export default memo(Like);
