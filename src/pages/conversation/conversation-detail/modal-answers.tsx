import { SettingFilled } from '@ant-design/icons';
import { Button, Col, Input, Modal, Row, Tooltip } from 'antd';
import { push } from 'connected-react-router';
import { filter, keyBy, map } from 'lodash';
import React, { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChatIcon } from '../../../assets/icon';
import { Loading } from '../../../components';
import useModal from '../../../hooks/use-modal';
import { IConversation, IFacebookState } from '../../../reducers/fanpageState/fanpageReducer';
import { QuickMessageInterface } from '../../../reducers/setting/interfaces';
import { setDefaultActiveKey } from '../../../reducers/setting/settingAction';
import { IState as SettingState } from '../../../reducers/setting/settingReducer';
import QuickMessageItem from './quick-message-item';

interface Props {
    chat?: boolean;
    disabled?: boolean;
}

const ModalAnswers: FC<Props> = ({ chat = false, disabled = false }): JSX.Element => {
    const [text, setText] = useState('');
    const { visible, toggle } = useModal();
    const dispatch = useDispatch();
    const loading = useSelector(({ setting }: { setting: SettingState }) => setting.loading);

    const quickMessage = useSelector(
        ({ setting }: { setting: SettingState }) => setting.quickMessage
    );

    const conversation: IConversation = useSelector(
        ({ fanpage }: { fanpage: IFacebookState }) => fanpage.conversation
    );

    const searchQuickMessage = (e: any) => {
        let str = e.target.value;

        setText(str);
    };

    const renderQuickMessage = () => {
        if (loading) return <Loading />;

        const filter_quick_message = keyBy(
            filter(quickMessage, (item: QuickMessageInterface) => {
                return (item.message as string).includes(text);
            }),
            '_id'
        );

        return (
            <div>
                {map(filter_quick_message, (message: QuickMessageInterface) => {
                    return (
                        <QuickMessageItem
                            conversation={conversation}
                            key={message._id}
                            message={message}
                            toggleModal={toggle}
                            chat={chat}
                            fbUsername={conversation.fbUsername}
                        />
                    );
                })}
            </div>
        );
    };

    const handleSetting = () => {
        dispatch(setDefaultActiveKey('quick_message'));
        dispatch(push('/customer/other/setting'));
    };

    return (
        <>
            <div
                onClick={!disabled ? toggle : undefined}
                className={`item${disabled ? ' item-disabled' : ''}`}
            >
                <Tooltip title='Trả lời nhanh' placement='top'>
                    <ChatIcon />
                </Tooltip>
            </div>
            <Modal
                closable={false}
                visible={visible}
                onCancel={toggle}
                onOk={toggle}
                footer={null}
                bodyStyle={{ padding: 0 }}
            >
                <div className='title-modal-quick-message'>
                    <Row gutter={15} style={{ padding: 15 }} align='middle' justify='center'>
                        <Col>Trả lời nhanh</Col>
                        <Col style={{ flex: 1 }}>
                            <Input value={text} onChange={searchQuickMessage} />
                        </Col>
                        <Col>
                            <Button icon={<SettingFilled />} onClick={handleSetting}>
                                Cài đặt
                            </Button>
                        </Col>
                    </Row>
                </div>

                <div>{renderQuickMessage()}</div>
            </Modal>
        </>
    );
};

export default ModalAnswers;
