import { PlusCircleOutlined } from '@ant-design/icons';
import { Col, Row, Space } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React from 'react';
import useModal from '../../../hooks/use-modal';
import FormAddProduct from './add-product-form';

const AddProduct = () => {
    const { visible, toggle } = useModal();

    return (
        <>
            <Row justify='end'>
                <Col>
                    <a onClick={toggle} style={{ display: 'inline-block', marginTop: 15 }}>
                        <Space size={5}>
                            Thêm sản phẩm <PlusCircleOutlined />
                        </Space>
                    </a>
                </Col>
            </Row>

            <Modal
                visible={visible}
                onCancel={toggle}
                footer={null}
                title='Thêm sản phẩm'
                destroyOnClose
            >
                <FormAddProduct onCancel={toggle} />
            </Modal>
        </>
    );
};

export default AddProduct;
