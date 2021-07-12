import { LoadingOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React, { FC, memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { labelConversationApi } from '../../../api/conversation-api';
import { CloseIcon } from '../../../assets/icon';
import { ILabel } from '../../../collections/label';
import { IAuthState } from '../../../reducers/authState/authReducer';
import { updateLabelConversations } from '../../../reducers/fanpageState/fanpageAction';
import { IConversation, IFacebookState } from '../../../reducers/fanpageState/fanpageReducer';
import { IStoreState } from '../../../reducers/storeState/storeReducer';
import { useConversationDetail } from './context';
import { LabelType } from './labels';

interface Props {
    label: ILabel;
    close?: boolean;
    block?: boolean;
}

const Label: FC<Props> = ({ label, close = false, block = false }): JSX.Element => {
    const conversation: IConversation = useSelector(
        ({ fanpage }: { fanpage: IFacebookState }) => fanpage.conversation
    );
    const store = useSelector(({ store }: { store: IStoreState }) => store.store);
    const token: any = useSelector(({ auth }: { auth: IAuthState }) => auth.token);

    const dispatch = useDispatch();

    const { labelIds, updateLabels } = useConversationDetail();
    const [loading, setLoading] = useState(false);

    const isActive = labelIds && labelIds.filter((item) => item._id === label._id).length > 0;

    const handleClickLabel = () => {
        if (!loading) {
            setLoading(true);
            labelConversationApi({
                storeId: store._id,
                fbPageId: conversation.fbPageId,
                token: token.accessToken,
                conversationId: conversation._id,
                action: isActive ? 'unset' : 'set',
                labelId: label._id,
            })
                .then((res: any) => {
                    updateLabels(label);
                    dispatch(
                        updateLabelConversations({
                            conversation,
                            label,
                        })
                    );
                    setLoading(false);
                })
                .catch((err) => {
                    setLoading(false);
                });
        }
    };

    const style = {
        background: label.backgroundColor,
        color: label.color,
        opacity: isActive || loading ? 1 : 0.5,
        display: block ? 'block' : 'inline-block',
    };

    const className = close ? 'label close' : 'label';

    return (
        <div className={className} style={style} onClick={handleClickLabel} title={label.name}>
            <Row align='middle' justify='space-between' gutter={15}>
                <Col>{label.name}</Col>

                {close && <Col>{loading ? <LoadingOutlined /> : <CloseIcon />}</Col>}
            </Row>
        </div>
    );
};

export default memo(Label);
