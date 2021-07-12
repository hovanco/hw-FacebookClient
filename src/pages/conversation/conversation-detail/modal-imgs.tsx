import { Badge, Modal, Spin, Tooltip } from 'antd';
import _get from 'lodash/get';
import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { sendReply } from '../../../api/conversation-api';
import { PhotoIcon } from '../../../assets/icon';
import { IImage } from '../../../collections/image';
import useModal from '../../../hooks/use-modal';
import { IConversation } from '../../../reducers/fanpageState/fanpageReducer';
import { useConversationDetail } from './context';
import ImgsLibrary from './imgs-library';

interface Props {
    disabled?: boolean;
}

const ModalImgs: FC<Props> = ({ disabled = false }): JSX.Element => {
    const [loading, setLoading] = useState(false);
    const { visible, toggle } = useModal();
    const { images, removeMessageError, setMessagesSending } = useConversationDetail();

    const conversation: IConversation = useSelector((state: any) => state.fanpage.conversation);

    const store = useSelector((state: any) => state.store.store);

    const token: any = useSelector((state: any) => state.auth.token);

    const renderNumber = images.length > 0 ? <Badge count={images.length} /> : null;

    const handleImageSelect = (images: IImage[], messages: any) => {
        setLoading(true);
        sendReply({
            fbPageId: conversation.fbPageId,
            token: token.accessToken,
            storeId: store._id,
            id: conversation.fbUserId,
            type: conversation.type,
            fbObjectId: conversation.fbObjectId,
            images,
        })
            .then((res: any) => {
                messages = messages.map((message: any, messageIndex: number) => {
                    return {
                        ...message,
                        id:
                            _get(res, `[0].${messageIndex}.data.id`) ||
                            _get(res, `[0].${messageIndex}.data.message_id`),
                    };
                });

                setMessagesSending(messages);
                setLoading(false);
            })
            .catch((error) => {
                for (const message of messages) {
                    removeMessageError(message);
                }
                setLoading(false);
            });
    };

    return (
        <>
            <div
                onClick={!disabled ? toggle : undefined}
                className={`item${disabled ? ' item-disabled' : ''}`}
            >
                <Tooltip title='Chọn hình ảnh' placement='top'>
                    <PhotoIcon />
                </Tooltip>
                <span className='text'> {renderNumber}</span>
                {loading && <Spin size='small' />}
            </div>
            <Modal
                footer={null}
                visible={visible}
                onCancel={toggle}
                onOk={toggle}
                bodyStyle={{ padding: 0 }}
                width={900}
                closeIcon={null}
                closable={false}
                destroyOnClose
            >
                <ImgsLibrary
                    toggle={toggle}
                    handleImageSelect={handleImageSelect}
                    type={conversation && conversation.type}
                />
            </Modal>
        </>
    );
};

export default ModalImgs;
