import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Row, Space } from 'antd';
import { Store } from 'antd/lib/form/interface';
import { omit } from 'lodash';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import storeApi from '../../../api/store-api';

import { IAuthState } from '../../../reducers/authState/authReducer';
import { IConversation, IFacebookState } from '../../../reducers/fanpageState/fanpageReducer';
import { IStoreState } from '../../../reducers/storeState/storeReducer';

interface Props {
    value: string;
    field: string;
    dataCustomer: any;
    empty?: string;

    onChange: (field: string, value: any) => void;
}

const EditField = ({ value, field, onChange, empty, dataCustomer }: Props) => {
    const token: any = useSelector(({ auth }: { auth: IAuthState }) => auth.token);
    const store = useSelector(({ store }: { store: IStoreState }) => store.store);
    const conversation: IConversation = useSelector(
        ({ fanpage }: { fanpage: IFacebookState }) => fanpage.conversation
    );

    const [loading, setLoading] = useState(false);
    const [edit, setEdit] = useState(false);

    const toggleEdit = () => setEdit(!edit);

    const onSubmit = async (values: Store) => {
        try {
            const data = {
                ...omit(dataCustomer, ['_id']),
                ...values,
                fbPageId: store.activePage._id,
                fbUserId: conversation.fbUserId,
            };

            let res;

            if (dataCustomer._id || dataCustomer._id.length === 0) {
                res = await storeApi.createCustomer({
                    token: token.accessToken,
                    storeId: store._id,
                    data,
                });

                message.success('Đã tạo thành công khách hàng');
            } else {
                res = await storeApi.updateCustomer({
                    token: token.accessToken,
                    storeId: store._id,
                    customerId: dataCustomer._id,
                    data,
                });
                message.success('Cập nhật thành công khách hàng');
            }

            setLoading(false);
        } catch (error) {
            setLoading(false);
            message.error('Đã có lỗi xảy ra!');
        }
    };

    if (edit) {
        return (
            <Form
                initialValues={{
                    [field]: value,
                }}
                onFinish={onSubmit}
            >
                <Row align='middle' justify='space-between' gutter={5}>
                    <Col style={{ flex: 1 }}>
                        <Form.Item
                            style={{ margin: 0 }}
                            name={field}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input size='small' placeholder={empty} />
                        </Form.Item>
                    </Col>

                    <Col>
                        <Form.Item style={{ margin: 0 }}>
                            <Space size={2}>
                                <Button
                                    type='primary'
                                    htmlType='submit'
                                    size='small'
                                    loading={loading}
                                >
                                    <CheckCircleOutlined />
                                </Button>
                                <Button onClick={toggleEdit} size='small'>
                                    <CloseCircleOutlined />
                                </Button>
                            </Space>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    }
    return (
        <Row align='middle' justify='space-between'>
            <Col>{value || empty}</Col>
            {/* <Col>
                <EditOutlined onClick={toggleEdit} />
            </Col> */}
        </Row>
    );
};

export default EditField;
