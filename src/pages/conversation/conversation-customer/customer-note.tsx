import { useSelector } from 'react-redux';
import { Button, Col, Form, Input, Row, message } from 'antd';
import React, { FC, useState } from 'react';
import { IAuthState } from '../../../reducers/authState/authReducer';
import { IStoreState } from '../../../reducers/storeState/storeReducer';
import storeApi from '../../../api/store-api';

interface Props {
    customer: any;
    onChange: (value: string) => void;
}

const FormAddCustomerNote: FC<Props> = ({ customer, onChange }) => {
    const token: any = useSelector(({ auth }: { auth: IAuthState }) => auth.token);
    const store = useSelector(({ store }: { store: IStoreState }) => store.store);
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState<any>(customer.note);
    const [disable, setDisable] = useState(true);

    const [formNote] = Form.useForm();

    const disableNote = !customer._id;

    const onFinish = async () => {
        try {
            setLoading(true);
            const res = await storeApi.updateCustomer({
                token: token.accessToken,
                storeId: store._id,
                customerId: customer._id,
                data: {
                    note: text,
                    province: customer.province,
                    district: customer.district,
                    ward: customer.ward,
                    phoneNo: customer.phoneNo,
                },
            });

            onChange(text);
            setDisable(true);
            setLoading(false);
            message.success('Lưu thành công');
        } catch (e) {
            message.error('Đã có lỗi xảy ra');
            setLoading(false);
        }
    };

    const onCancel = () => {
        setText(customer.note);
        setDisable(true);
        formNote.resetFields();
        formNote.setFieldsValue({
            note: customer.note,
        });
    };

    const handleChangeText = (e: any) => {
        setText(e.target.value);
        setDisable(false);
    };

    const handleNote = () => {
        message.warning('Vui lòng tạo thông tin khách hàng trước khi nhập ghi chú.', 2);
    }

    const handleClick = () => {
        if(disableNote) { 
            handleNote();
        }
    }

    return (
        <Form className='form-add-customer-note' form={formNote} onFinish={onFinish}>
            <Form.Item
                name='note'
                rules={[{ required: true, message: 'Nhập ghi chú' }]}
                initialValue={text}
            >
                <Input.TextArea
                    placeholder='Nhập ghi chú'
                    rows={3}
                    onChange={handleChangeText}
                    readOnly={disableNote}
                    onClick={handleClick}
                ></Input.TextArea>
            </Form.Item>

            <Row justify='end' align='middle' gutter={10}>
                <Col>
                    <Button disabled={disable} onClick={onCancel}>
                        Hủy
                    </Button>
                </Col>
                <Col>
                    <Button
                        type='primary'
                        htmlType='submit'
                        disabled={disable || !customer._id}
                        loading={loading}
                    >
                        Lưu
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

const CutomerNote: FC<Props> = ({ customer, onChange }) => {
    return (
        <div className='customer-note'>
            <Row justify='space-between' align='middle'>
                <Col>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: 5 }}>Ghi chú</span>
                    </div>
                </Col>
            </Row>

            <div className='customer-note-content'>
                <FormAddCustomerNote customer={customer} onChange={onChange} />
            </div>
        </div>
    );
};

export default CutomerNote;
