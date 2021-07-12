import React, { FC } from 'react';
import { Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import useModal from '../../hooks/use-modal';
import FormAddProduct from './form-add-product';

interface IProps {
    reloadTable: any;
}

const AddProduct: FC<IProps> = (props): JSX.Element => {
    const { toggle, visible } = useModal();
    return (
        <>
            <Button type='primary' icon={<PlusOutlined />} onClick={toggle}>
                Thêm
            </Button>

            <Modal
                visible={visible}
                onCancel={toggle}
                onOk={toggle}
                title='Thêm sản phẩm'
                footer={null}
            >
                <FormAddProduct toggle={toggle} {...props} visible={visible} />
            </Modal>
        </>
    );
};

export default AddProduct;
