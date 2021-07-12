import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, message } from 'antd';
import React, { FC, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { createProductRequest } from '../../../api/product-api';
import { IAuthState } from '../../../reducers/authState/authReducer';
import { IStoreState } from '../../../reducers/storeState/storeReducer';
import { formatterInput, parserInput } from '../../../utils/format-money';
import { useOrder } from './context-order';

const style = { marginBottom: 10 };

interface Props {
    onCancel: () => void;
}

const AddProductForm: FC<Props> = ({ onCancel }): JSX.Element => {
    const { order, setOrder } = useOrder();
    const token: any = useSelector(({ auth }: { auth: IAuthState }) => auth.token);
    const store = useSelector(({ store }: { store: IStoreState }) => store.store);

    const [loading, setLoading] = useState(false);
    const [formProduct] = Form.useForm();
    const formRef = useRef<any>(null);

    const resetForm = () => {
        if (formRef && formRef.current) {
            formRef.current.resetFields();
        }
        onCancel();
    };

    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);
            const response = await createProductRequest({
                token: token.accessToken,
                storeId: store._id,
                data: values,
            });
            setLoading(false);

            const newProducts = [
                ...order.products,
                {
                    name: response.name,
                    productId: response._id,
                    count: 1,
                    price: response.price,
                    weight: response.weight,
                },
            ];

            const newOrder = { ...order, products: newProducts };
            setOrder(newOrder);

            resetForm();
            message.success('Thêm sản phẩm thành công');
            onCancel();
        } catch (error) {
            setLoading(false);
            message.error('Đã có lỗi xảy ra!');
        }
    };

    return (
        <Form ref={formRef} form={formProduct} onFinish={handleSubmit} layout='vertical'>
            <Form.Item
                label='Tên sản phẩm'
                name='name'
                style={{ ...style }}
                rules={[{ required: true, message: 'Điền tên sản phẩm' }]}
            >
                <Input placeholder='' />
            </Form.Item>

            <Form.Item
                label='Giá (vnd)'
                name='price'
                style={{ ...style }}
                rules={[
                    {
                        required: true,
                        message: 'Điền giá sản phẩm',
                        type: 'number',
                    },
                ]}
            >
                <InputNumber
                    style={{ width: 350 }}
                    formatter={formatterInput}
                    parser={parserInput}
                />
            </Form.Item>

            <Form.Item
                label='Khối lượng (gram)'
                name='weight'
                style={{ ...style }}
                rules={[
                    {
                        required: true,
                        message: 'Khối lượng sản phẩm tối thiểu 10g',
                        type: 'number',
                        min: 10,
                        max: 1000000,
                    },
                ]}
            >
                <InputNumber
                    style={{ width: 350 }}
                    formatter={formatterInput}
                    parser={parserInput}
                />
            </Form.Item>

            <div style={{ marginTop: '30px', textAlign: 'end' }}>
                <Button
                    type='primary'
                    style={{ marginRight: 15 }}
                    htmlType='submit'
                    loading={loading}
                    icon={<SaveOutlined />}
                >
                    Lưu lại
                </Button>
                <Button onClick={resetForm} icon={<CloseOutlined />}>
                    Hủy
                </Button>
            </div>
        </Form>
    );
};

export default AddProductForm;
