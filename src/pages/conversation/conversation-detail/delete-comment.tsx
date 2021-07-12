import { message, Modal, Tooltip } from 'antd';
import { isEmpty } from 'lodash';
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteComment } from '../../../api/conversation-api';
import { TrashIcon } from '../../../assets/icon';
import { IAuthState } from '../../../reducers/authState/authReducer';
import {
    removeConversation,
    setNullForConversation,
    updateMainCommentConversation,
} from '../../../reducers/fanpageState/fanpageAction';
import { IConversation, IFacebookState } from '../../../reducers/fanpageState/fanpageReducer';
import { IStoreState } from '../../../reducers/storeState/storeReducer';
import { Comment, useConversationDetail } from './context';

interface Props {
    comment: Comment;
}

const DeleteComment: FC<Props> = ({ comment }): JSX.Element => {
    const conversation: IConversation = useSelector(
        ({ fanpage }: { fanpage: IFacebookState }) => fanpage.conversation
    );
    const store = useSelector(({ store }: { store: IStoreState }) => store.store);

    const token: any = useSelector(({ auth }: { auth: IAuthState }) => auth.token);

    const { deleteMessage, getComments } = useConversationDetail();

    const dispatch = useDispatch();

    const showDeleteConfirm = () => {
        Modal.confirm({
            title: 'Xóa bình luận?',
            content: 'Bạn chắc chắn muốn xóa bình luận này?',
            okText: 'Xóa bình luận',
            okType: 'danger',
            cancelText: 'Hủy',
            width: 450,
            onOk() {
                handleDeleteComment();
            },
            onCancel() {},
        });
    };

    const handleDeleteComment = async () => {
        try {
            const res = await deleteComment({
                commentId: comment.id,
                fbPageId: conversation.fbPageId,
                storeId: store._id,
                token: token.accessToken,
                conversationId: conversation._id,
            });
            deleteMessage(comment);
            if (comment.id === conversation.fbObjectId) {
                if (isEmpty(conversation.commentIds)) {
                    dispatch(setNullForConversation());
                    dispatch(
                        removeConversation({
                            conversationId: conversation._id,
                        })
                    );
                } else {
                    const fbObjectId = (conversation.commentIds || []).shift() || '';
                    dispatch(
                        updateMainCommentConversation({
                            conversationId: conversation._id,
                            fbObjectId,
                            commentIds: conversation.commentIds || [],
                        })
                    );
                }
                return;
            } else if (
                Array.isArray(conversation.commentIds) &&
                conversation.commentIds.includes(comment.id)
            ) {
                dispatch(
                    updateMainCommentConversation({
                        conversationId: conversation._id,
                        fbObjectId: conversation.fbObjectId,
                        commentIds: conversation.commentIds.filter((id) => id !== comment.id),
                    })
                );
            }
        } catch (error) {
            message.error('Đã có lỗi xảy ra!');
        }
    };

    return (
        <Tooltip placement='top' title='Xóa bình luận'>
            <div className='bubble_action-item'>
                <TrashIcon onClick={showDeleteConfirm} />
            </div>
        </Tooltip>
    );
};

export default DeleteComment;
