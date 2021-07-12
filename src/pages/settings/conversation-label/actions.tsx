import React from 'react';
import { Menu, Dropdown, Button, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, MenuOutlined } from '@ant-design/icons';

interface IProps {
    onEdit: () => void;
    onDelete: () => void;
}

function Action({ onEdit, onDelete }: IProps): JSX.Element {
    const showDeleteConfirm = () => {
        Modal.confirm({
            title: 'Xóa nhãn hội thoại',
            content: `Bạn chắc chắn muốn xóa nhãn hội thoại`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                onDelete();
            },
            onCancel() {},
        });
    };

    const menu = (
        <Menu>
            <Menu.Item key='edit' icon={<EditOutlined />} onClick={onEdit}>
                Chỉnh sửa
            </Menu.Item>
            <Menu.Item key='delete' icon={<DeleteOutlined />} danger onClick={showDeleteConfirm}>
                Xoá
            </Menu.Item>
        </Menu>
    );

    return (
        <Dropdown overlay={menu} trigger={['click']} placement='bottomRight'>
            <Button type='text' icon={<MenuOutlined />} />
        </Dropdown>
    );
}

export default Action;
