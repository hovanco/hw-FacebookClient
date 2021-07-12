import { CloseOutlined, CopyOutlined } from '@ant-design/icons';
import { Button, Col, Form, Modal, Radio, Row, Select, message, Checkbox } from 'antd';
import { filter, map } from 'lodash';
import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';

import * as settingApi from '../../../api/setting';
import useModal from '../../../hooks/use-modal';
import { Page } from '../../../reducers/fanpageState/fanpageReducer';
import { useContextLabel } from './context';

interface Props {}

const title = 'Copy sang page khác';

const ModalCopyLabel: FC<Props> = (props): JSX.Element => {
    const [loading, setLoading] = useState(false);
    const store = useSelector((state: any) => state.store.store);
    const pages = useSelector((state: any) => state.fanpage.pages);
    const labels = useSelector((state: any) => state.label.labels);
    const { page, labelIds } = useContextLabel();

    const { visible, toggle } = useModal();

    const onChangeOption = (e: any) => {};

    const filter_pages = filter(pages, (p: Page) => p._id !== page);

    const handleSubmit = async (val: any) => {
        setLoading(true);

        try {
            const storeId = store._id;

            const labelIdsSelect =
                labelIds.length === 0 ? Object.keys(labels).map((key: string) => key) : labelIds;

            await settingApi.cloneLabels({
                storeId,
                pageId: (pages[page as string] as Page).fbObjectId,
                data: {
                    fbPageId: val.fbPageId,
                    copyAll: val.copyAll,
                    replace: val.replace === 1,
                    labelIds: labelIdsSelect,
                },
            });

            message.success('Sao chép thành công');
            toggle();

            setLoading(false);
        } catch (error) {
            setLoading(false);
            message.error('Sao chép thất bại');
        }
    };

    return (
        <>
            <Button icon={<CopyOutlined />} onClick={toggle} className='primary-icon'>
                {title}
            </Button>

            <Modal
                visible={visible}
                onCancel={toggle}
                destroyOnClose={true}
                title={title}
                footer={null}
            >
                <Form
                    onFinish={handleSubmit}
                    layout='vertical'
                    initialValues={{
                        fbPageId: filter_pages.length > 0 ? filter_pages[0].fbObjectId : undefined,
                        replace: 1,
                        copyAll: labelIds.length === 0,
                    }}
                >
                    <Form.Item name='fbPageId'>
                        <Select>
                            {map(filter_pages, (p: Page) => (
                                <Select.Option key={p._id} value={p.fbObjectId}>
                                    {p.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name='replace'>
                        <Radio.Group onChange={onChangeOption}>
                            <Radio value={1}>Thay thế danh sách đã có</Radio>
                            <Radio value={2}>Thêm mới vào danh sách</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item name='copyAll' valuePropName='checked'>
                        <Checkbox>Sao chép tất cả</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Row gutter={15}>
                            <Col>
                                <Button icon={<CloseOutlined />} onClick={toggle}>
                                    Hủy
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    type='primary'
                                    htmlType='submit'
                                    loading={loading}
                                    icon={<CopyOutlined />}
                                >
                                    Copy
                                </Button>
                            </Col>
                        </Row>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ModalCopyLabel;
