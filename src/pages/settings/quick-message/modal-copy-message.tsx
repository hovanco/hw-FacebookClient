import { CloseOutlined, CopyOutlined } from '@ant-design/icons';
import { Button, Form, message, Modal, Radio, Select, Space, Checkbox } from 'antd';
import { Store } from 'antd/lib/form/interface';
import { filter } from 'lodash';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import * as settingApi from '../../../api/setting';
import { Page } from '../../../reducers/fanpageState/fanpageReducer';

interface IProps {
    visible: boolean;
    toggle: () => void;
    pageId: string;
    storeId: string;
    quickAnswerIds: string[];
}

const { Option } = Select;

function QuickMessageModal({
    visible,
    toggle,
    pageId,
    storeId,
    quickAnswerIds,
}: IProps): JSX.Element {
    const [loading, setLoading] = useState(false);
    const pages = useSelector((state: any) => state.fanpage.pages);
    const quickMessages = useSelector((state: any) => state.setting.quickMessage);

    const page = pages[pageId] as Page;

    const handleSubmit = async (val: Store) => {
        setLoading(true);

        try {
            const response = await settingApi.cloneQuickMessage({
                storeId,
                pageId: page.fbObjectId,
                data: {
                    fbPageId: val.fbPageId,
                    copyAll: val.copyAll,
                    replace: val.replace === 1,
                    quickAnswerIds,
                },
            });
            message.success('Sao chép thành công');
            toggle();
            setLoading(false);
        } catch (error) {
            message.error('Sao chép thất bại');
            setLoading(false);
        }
    };

    const filter_pages = filter(pages, (page: Page) => page._id !== pageId);

    return (
        <Modal
            visible={visible}
            title='Copy tin nhắn nhanh sang page khác'
            destroyOnClose
            onCancel={toggle}
            footer={null}
        >
            <Form
                className='quick-message-form'
                onFinish={handleSubmit}
                layout='vertical'
                initialValues={{
                    fbPageId: filter_pages.length > 0 ? filter_pages[0].fbObjectId : undefined,
                    replace: 1,
                    copyAll: quickAnswerIds.length === 0,
                }}
            >
                <Form.Item
                    name='fbPageId'
                    label='Chọn page'
                    rules={[{ required: true, message: 'Chọn page.' }]}
                >
                    <Select>
                        {filter_pages.map((page: Page) => (
                            <Option value={page.fbObjectId} key={page._id}>
                                {page.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name='replace'>
                    <Radio.Group>
                        <Radio value={1}>Thay thế danh sách đã có</Radio>
                        <Radio value={2}>Thêm mới vào danh sách đã có</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item name='copyAll' valuePropName='checked'>
                    <Checkbox>Sao chép tất cả</Checkbox>
                </Form.Item>

                <Form.Item noStyle>
                    <Space>
                        <Button icon={<CloseOutlined />} onClick={toggle}>
                            Huỷ
                        </Button>
                        <Button
                            htmlType='submit'
                            loading={loading}
                            type='primary'
                            icon={<CopyOutlined />}
                        >
                            Sao chép
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default QuickMessageModal;
