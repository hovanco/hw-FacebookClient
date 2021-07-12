import { MinusCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { message, Tooltip, Modal } from 'antd';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { toggleBlockUser } from '../../../api/conversation-api';
import { toggleBlockUser as toggleBlockUserAction } from '../../../reducers/fanpageState/fanpageAction';
import { IConversation } from '../../../reducers/fanpageState/fanpageReducer';

const ToggleBlockBtn = (): JSX.Element => {
    const conversation: IConversation = useSelector((state: any) => state.fanpage.conversation);
    const store = useSelector((state: any) => state.store.store);
    const token: any = useSelector((state: any) => state.auth.token);
    const [blocked, setBlocked] = useState(() => {
        if (conversation.blocked) return conversation.blocked;
        return false;
    });
    const dispatch = useDispatch();
    const { confirm } = Modal;

    const message_text = {
        success: `Đã ${blocked ? 'mở khóa' : 'khóa'} tài khoản.`,
        error: `Lỗi ${blocked ? 'mở khóa' : 'khóa'} tài khoản.`,
    };

    useEffect(() => {
        if (conversation) {
            setBlocked(conversation.blocked || false);
        }
    }, [conversation]);

    const showConfirm = () => {
        confirm({
            title: blocked
                ? 'Bạn có thực sự muốn bỏ chặn?'
                : 'Bạn có thực sự muốn chặn khách hàng?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                toggleUser();
            },
            onCancel() {},
        });
    };

    const toggleUser = async () => {
        const data = {
            token: token.accessToken,
            pageId: conversation.fbPageId,
            storeId: store._id,
            userId: conversation.fbUserId,
        };

        try {
            const response = await toggleBlockUser({
                ...data,
                blocked: !blocked,
            });

            dispatch(toggleBlockUserAction(conversation));

            setBlocked(!blocked);

            message.success(message_text.success);
        } catch (error) {
            message.error(message_text.error);
        }
    };
    return (
        <Tooltip placement='bottom' title={blocked ? 'Bỏ chặn khách hàng' : 'Chặn khách hàng'}>
            <MinusCircleOutlined
                onClick={showConfirm}
                style={{ color: blocked ? 'red' : 'inherit' }}
            />
        </Tooltip>
    );
};

export default ToggleBlockBtn;
