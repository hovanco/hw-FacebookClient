import _ from 'lodash';
import React, { FC, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tooltip, message, Modal } from 'antd';
import { EyeInvisibleOutlined } from '@ant-design/icons';

import { hideComment } from '../../../api/conversation-api';
import { IAuthState } from '../../../reducers/authState/authReducer';
import { IConversation, IFacebookState } from '../../../reducers/fanpageState/fanpageReducer';
import { IStoreState } from '../../../reducers/storeState/storeReducer';
import { Comment } from './context';
import { updateHiddenCommentsConversation } from '../../../reducers/fanpageState/fanpageAction';

interface Props {
    comment: Comment;
}

const Hide: FC<Props> = ({ comment }): JSX.Element => {
    const dispatch = useDispatch();
    const conversation: IConversation = useSelector(
        ({ fanpage }: { fanpage: IFacebookState }) => fanpage.conversation
    );
    const store = useSelector(({ store }: { store: IStoreState }) => store.store);

    const token: any = useSelector(({ auth }: { auth: IAuthState }) => auth.token);

    const [hided, setHided] = useState(() => {
        return _.get(conversation.hiddenComments, `${comment.id}`, false);
    });

    const showHideConfirm = () => {
        Modal.confirm({
            title: hided ? 'Bỏ ẩn bình luận' : 'Ẩn bình luận',
            content: hided
                ? 'Bạn chắc chắn muốn bỏ ẩn bình luận này?'
                : 'Bạn chắc chắn muốn ẩn bình luận này?',
            okText: hided ? 'Bỏ ẩn bình luận' : 'Ẩn bình luận',
            okType: 'danger',
            cancelText: 'Hủy',
            width: 450,
            onOk() {
                toggleHide();
            },
            onCancel() {},
        });
    };

    const toggleHide = async () => {
        hideComment({
            commentId: comment.id,
            fbPageId: conversation.fbPageId,
            storeId: store._id,
            token: token.accessToken,
            isHidden: !hided,
            fbConversationId: conversation._id,
        })
            .then(() => {
                setHided(!hided);
                dispatch(
                    updateHiddenCommentsConversation({
                        conversationId: conversation._id,
                        commentId: comment.id,
                        value: !hided,
                    })
                );
            })
            .catch((err) => {
                message.error('Đã có lỗi xảy ra!');
            });
    };

    const className = hided ? 'bubble_action-item active' : 'bubble_action-item';

    return (
        <Tooltip placement='top' title={hided ? 'Bỏ ẩn bình luận' : 'Ẩn bình luận'}>
            <div className={className}>
                <EyeInvisibleOutlined onClick={showHideConfirm} />
            </div>
        </Tooltip>
    );
};

export default Hide;
