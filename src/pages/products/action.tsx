import React, { FC } from 'react';
import { Menu, Dropdown, Modal, Button } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { IProduct } from './interface';

interface Props {
    product: IProduct;
    removeProduct: () => void;
    onCancel: () => void;
    onEdit: () => void;
}

const Action: FC<Props> = ({ product, removeProduct, onCancel, onEdit }): JSX.Element => {
    const showDeleteConfirm = () => {
        Modal.confirm({
            title: 'Xóa sản phẩm?',
            content: `Bạn chắc chắn muốn xóa sản phẩm ${product.name}`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                removeProduct();
            },
            onCancel() {
                onCancel();
            },
        });
    };

    const menu = (
        <Menu>
            <Menu.Item key='1' onClick={onEdit}>
                Sửa
            </Menu.Item>

            <Menu.Item key='2' onClick={showDeleteConfirm}>
                Xóa
            </Menu.Item>
        </Menu>
    );

    return (
        <Dropdown overlay={menu} trigger={['click']}>
            <Button icon={<EllipsisOutlined />}></Button>
        </Dropdown>
    );
};

export default Action;
