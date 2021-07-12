import { MinusCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Space } from 'antd';
import moment from 'moment';
import React, { FC, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { markAsUnreadApi } from '../../../api/conversation-api';
import { FacebookOutlinedIcon, MessageIcon } from '../../../assets/icon';
import { IAuthState } from '../../../reducers/authState/authReducer';
import {
    selectConversation,
    setNullForConversation,
    updateCountUnreadPage,
} from '../../../reducers/fanpageState/fanpageAction';
import { IConversation, IFacebookState } from '../../../reducers/fanpageState/fanpageReducer';
import { IStoreState } from '../../../reducers/storeState/storeReducer';
import { generateUrlImgFb } from '../../../utils/generate-url-img-fb';

interface Props {
    conversation: IConversation;
}

const ConversationItem: FC<Props> = ({ conversation }): JSX.Element => {
    const dispatch = useDispatch();
    const conversation_select = useSelector(
        ({ fanpage }: { fanpage: IFacebookState }) => fanpage.conversation
    );

    const store = useSelector(({ store }: { store: IStoreState }) => store.store);

    const token: any = useSelector(({ auth }: { auth: IAuthState }) => auth.token);

    const page = useSelector(({ fanpage }: { fanpage: IFacebookState }) => fanpage.page);

    const updateYear = moment(conversation.updatedAt).format('YYYY');
    const nowYear = moment().format('YYYY');
    const format_date = updateYear === nowYear ? 'DD/MM' : 'DD/MM/YY';
    const date = moment(conversation.updatedAt).format(format_date);

    const handleSelectConversation = async () => {
        await dispatch(setNullForConversation());
        dispatch(selectConversation(conversation));
        if (conversation.unread) {
            markAsUnreadApi({
                storeId: store._id,
                fbPageId: conversation.fbPageId,
                token: token.accessToken,
                conversationId: conversation.fbObjectId,
                read: true,
            }).then((res: any) => {
                dispatch(
                    updateCountUnreadPage({
                        fbObjectId: store.activePage.fbObjectId,
                    })
                );
            });
        }
    };

    const active = conversation_select && conversation._id === conversation_select._id;

    let className = active ? 'item active' : 'item';

    if (conversation.unread) className += ' unread';

    const classNameInfo = 'info';

    return (
        <div className={className} onClick={handleSelectConversation}>
            <div className='item-avatar'>
                <Avatar
                    src={generateUrlImgFb(conversation.fbUserId, page.accessToken)}
                    icon={<UserOutlined />}
                    size={50}
                />
                <span className='icon'>
                    {conversation.type === 1 ? <MessageIcon /> : <FacebookOutlinedIcon />}
                </span>
            </div>

            <div className={classNameInfo}>
                <div>
                    <span className='name'>{conversation.fbUsername}</span>{' '}
                    {conversation.blocked && <MinusCircleOutlined style={{ color: 'red' }} />}
                </div>

                <span className='message'>{conversation.message}</span>

                <div className='labels-wrap'>
                    {conversation.labelIds &&
                        conversation.labelIds.map((item) => (
                            <span
                                className='label'
                                style={{
                                    background: item.backgroundColor,
                                    color: item.color,
                                    fontWeight: conversation.unread ? 700 : 400,
                                }}
                                key={item._id}
                            >
                                {item.name}
                            </span>
                        ))}
                </div>
            </div>
            <div className='item-right'>
                <div className='date'>{date}</div>
            </div>
        </div>
    );
};

export default memo(ConversationItem);
