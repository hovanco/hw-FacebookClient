import React, { FC, useState, useEffect } from 'react';
import { useConversationDetail } from './context';
import { useSelector } from 'react-redux';

import _findLast from 'lodash/findLast';
import _get from 'lodash/get';
import _isObject from 'lodash/isObject';
import moment from 'moment';

import BoxReply from './box-reply';
import Labels from './labels';
import ModalAnswers from './modal-answers';
import Emoji from './modal-emoji';
import ModalImgs from './modal-imgs';
import ModalShortcut from './model-shortcut';
import { IConversation, IFacebookState } from '../../../reducers/fanpageState/fanpageReducer';
import { Space } from 'antd';
import LabelMore from './label-more';

const ConversationDetailAction: FC = (): JSX.Element => {
    const { messages } = useConversationDetail();

    const [disabled, setDisabled] = useState(true);

    const conversation: IConversation = useSelector(
        ({ fanpage }: { fanpage: IFacebookState }) => fanpage.conversation
    );

    const page: { fbObjectId: string; name: string } = useSelector(
        ({ fanpage }: { fanpage: any }) => fanpage.page
    );

    useEffect(() => {
        if (conversation.type === 2) {
            return setDisabled(false);
        }

        if (messages.length > 0 && conversation.type === 1) {
            const message = _findLast(messages, (o) => o.from.id !== page.fbObjectId);
            if (_isObject(message)) {
                const createDate = moment(message.created_time);
                const newDate = moment(new Date());

                if (newDate.diff(createDate, 'days', true) <= 1) {
                    return setDisabled(false);
                }
            }
        }

        setDisabled(true);
    }, [messages]);

    const { labels } = useConversationDetail();
    return (
        <div className='conversation-detail-action'>
            <Space size={20} align='center'>
                <ModalShortcut />
                <ModalImgs disabled={disabled} />
                <ModalAnswers disabled={disabled} />
                <LabelMore labels={labels} />
            </Space>

            <BoxReply disabled={disabled} />
        </div>
    );
};

export default ConversationDetailAction;
