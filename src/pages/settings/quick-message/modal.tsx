import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { SketchPicker } from 'react-color';
import { Modal, Form, Input, Tag, Button, Space } from 'antd';
import {
    BgColorsOutlined,
    HighlightOutlined,
    SaveOutlined,
    CloseOutlined,
} from '@ant-design/icons';
import { Store } from 'antd/lib/form/interface';

import { createQuickMessageAction, updateQuickMessageAction } from '../../../actions/setting';

interface IProps {
    visible: boolean;
    toggle: () => void;
    data: any;
    setCurrentItem: any;
}

const tags = [
    {
        id: 1,
        key: '{FULL_NAME}',
        description: 'Chèn tên khách hàng dưới dạng "mentions"(Nhắc tới..)',
    },
];

function QuickMessageModal({ visible, toggle, data = {}, setCurrentItem }: IProps): JSX.Element {
    const dispatch = useDispatch();
    const [title, setTitle] = useState({
        title: '',
        backgroundColor: '#87d068',
        color: '#000',
    });
    const [isShow, setIsShow] = useState({
        backgroundColor: false,
        color: false,
    });
    const modalTitle = data.mode === 'update' ? 'Sửa phím tắt' : 'Thêm phím tắt';

    useEffect(() => {
        if (data.title) {
            const { title, backgroundColor, color } = data;
            setTitle({
                title: title,
                backgroundColor,
                color,
            });
        }
    }, [data.title]);

    const resetForm = () => {
        setCurrentItem();
        setTitle({
            title: '',
            backgroundColor: '#87d068',
            color: '#000',
        });
    };

    const handleSubmit = async (val: Store) => {
        try {
            const fromData = {
                pageId: data.pageId,
                storeId: data.storeId,
                data: {
                    ...val,
                    order: 1,
                    ...title,
                },
                toggle,
            };

            if (data.mode === 'create') {
                await dispatch(createQuickMessageAction(fromData));
            } else if (data.mode === 'update') {
                await dispatch(updateQuickMessageAction({ ...fromData, quickId: data._id }));
            }

            resetForm();
        } catch (e) {}
    };

    const renderTags = (getFieldValue: any, setFieldsValue: any) => {
        const oldMessage = getFieldValue('message');

        return tags.map((tag) => (
            <div key={tag.id} style={{ marginBottom: 10 }}>
                <Tag
                    color='processing'
                    onClick={() => {
                        setFieldsValue({
                            message: oldMessage ? `${oldMessage} ${tag.key}` : tag.key,
                        });
                    }}
                    className='quick-message-form-tag'
                >
                    {tag.key}
                </Tag>
                <span>{tag.description}</span>
            </div>
        ));
    };

    const closeSketchColor = () => {
        setIsShow({
            backgroundColor: false,
            color: false,
        });
    };

    const handleChangeBackground = (color: { hex: string }) => {
        setTitle({ ...title, backgroundColor: color.hex });
        closeSketchColor();
    };

    const handleChangeColor = (color: { hex: string }) => {
        setTitle({ ...title, color: color.hex });
        closeSketchColor();
    };

    const onCancel = () => {
        resetForm();
        toggle();
    };

    return (
        <Modal
            visible={visible}
            onCancel={onCancel}
            title={modalTitle}
            width={640}
            destroyOnClose
            footer={null}
        >
            <Form className='quick-message-form' initialValues={data} onFinish={handleSubmit}>
                {title.title && (
                    <div className='quick-message-form-titletag'>
                        <Tag style={{ color: title.color }} color={title.backgroundColor}>
                            {title.title}
                        </Tag>
                    </div>
                )}
                <Form.Item style={{ marginBottom: 0 }}>
                    <Form.Item
                        name='title'
                        rules={[
                            {
                                required: true,
                                message: 'Điền tiêu đề tin nhắn.',
                            },
                        ]}
                        style={{ display: 'inline-block', width: '50%' }}
                    >
                        <Input
                            style={{ marginRight: 10 }}
                            placeholder='Tiêu đề'
                            onChange={(e: any) => setTitle({ ...title, title: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item
                        style={{ display: 'inline-block', width: '25%' }}
                        name='backgroundColor'
                    >
                        <Button
                            icon={<BgColorsOutlined />}
                            style={{
                                marginRight: 10,
                            }}
                            onClick={() => setIsShow({ ...isShow, backgroundColor: true })}
                        >
                            Chọn màu nền
                        </Button>

                        {isShow.backgroundColor && (
                            <SketchPicker
                                color={title.backgroundColor}
                                onChangeComplete={handleChangeBackground}
                            />
                        )}
                    </Form.Item>
                    <Form.Item style={{ display: 'inline-block', width: '25%' }} name='color'>
                        <Button
                            icon={<HighlightOutlined />}
                            style={{
                                marginRight: 10,
                            }}
                            onClick={() => setIsShow({ ...isShow, color: true })}
                        >
                            Chọn màu chữ
                        </Button>

                        {isShow.color && (
                            <SketchPicker
                                color={title.color}
                                onChangeComplete={handleChangeColor}
                            />
                        )}
                    </Form.Item>
                </Form.Item>
                <Form.Item name='shortcut' rules={[{ required: true, message: 'Điền phím tắt.' }]}>
                    <Input addonBefore='Phím tắt /' />
                </Form.Item>
                <Form.Item
                    name='message'
                    rules={[{ required: true, message: 'Nhập nội dung tin nhắn.' }]}
                >
                    <Input.TextArea placeholder='Nhập tin nhắn.'></Input.TextArea>
                </Form.Item>
                <Form.Item shouldUpdate>
                    {({ getFieldValue, setFieldsValue }) => {
                        return renderTags(getFieldValue, setFieldsValue);
                    }}
                </Form.Item>
                <Form.Item noStyle>
                    <Space>
                        <Button icon={<CloseOutlined />} onClick={onCancel}>
                            Huỷ
                        </Button>
                        <Button htmlType='submit' type='primary' icon={<SaveOutlined />}>
                            Lưu
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default QuickMessageModal;
