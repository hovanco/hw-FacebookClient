import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Modal, Row, message } from 'antd';
import { Store } from 'antd/lib/form/interface';
import { pick } from 'lodash';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { createProductRequest } from '../../../api/product-api';
import useModal from '../../../hooks/use-modal';
import { formatterInput, parserInput } from '../../../utils/format-money';

interface Props {
    addProduct: (product: any) => void;
}

const AddProduct = (props: Props) => {
    const { visible, toggle } = useModal();
    const [loading, setLoading] = useState(false);
    const token: any = useSelector((state: any) => state.auth.token);
    const store = useSelector((state: any) => state.store.store);

    const handleSubmit = async (values: Store) => {
        try {
            setLoading(true);

            const response = await createProductRequest({
                token: token.accessToken,
                storeId: store._id,
                data: values,
            });

            const product = pick(response, ['name', 'price', '_id', 'images']);

            props.addProduct(product);
            setLoading(false);
            toggle();
        } catch (error) {
            message.error('Lỗi tạo sản phẩm');
            setLoading(false);
        }
    };

    return (
        <div>
            <a onClick={toggle} className='add-product-toogle-btn'>
                <PlusCircleOutlined /> Thêm sản phẩm
            </a>

            <Modal
                visible={visible}
                onCancel={toggle}
                title='Thêm sản phẩm'
                footer={null}
                destroyOnClose
            >
                <Form layout='vertical' onFinish={handleSubmit}>
                    <Form.Item
                        label='Tên sản phẩm'
                        name='name'
                        rules={[{ required: true, message: 'Điền tên sản phẩm' }]}
                    >
                        <Input placeholder='' />
                    </Form.Item>

                    <Form.Item
                        label='Giá (vnd)'
                        name='price'
                        rules={[
                            {
                                required: true,
                                message: 'Điền giá sản phẩm',
                                type: 'number',
                            },
                        ]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={formatterInput}
                            parser={parserInput}
                        />
                    </Form.Item>

                    <Form.Item
                        label='Khối lượng (gram)'
                        name='weight'
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
                            style={{ width: '100%' }}
                            formatter={formatterInput}
                            parser={parserInput}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Row gutter={15} justify='end'>
                            <Col>
                                <Button onClick={toggle}>Hủy</Button>
                            </Col>
                            <Col>
                                <Button type='primary' htmlType='submit' loading={loading}>
                                    Tạo sản phẩm
                                </Button>
                            </Col>
                        </Row>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AddProduct;
