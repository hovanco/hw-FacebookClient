import React, { FC } from 'react';
import { Menu, Dropdown, Modal, Button } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { IWarehouse } from './interface';
import { useSelector } from 'react-redux';
import { IStoreState } from '../../reducers/storeState/storeReducer';

interface Props {
    warehouse: IWarehouse;
    removeWarehouse: () => void;
    onCancel: () => void;
    onEdit: () => void;
}

const Action: FC<Props> = ({ warehouse, removeWarehouse, onCancel, onEdit }): JSX.Element => {
    const store = useSelector(({ store }: { store: IStoreState }) => store.store);

    const showDeleteConfirm = () => {
        Modal.confirm({
            title: 'Xóa chi nhánh?',
            content: `Bạn chắc chắn muốn xóa chi nhánh ${warehouse.name}`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                removeWarehouse();
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

    const menuEdit = (
        <Menu>
            <Menu.Item key='1' onClick={onEdit}>
                Sửa
            </Menu.Item>
        </Menu>
    );

    return (
        <Dropdown
            overlay={store.warehouseId === warehouse._id ? menuEdit : menu}
            trigger={['click']}
            placement='topCenter'
        >
            <Button icon={<EllipsisOutlined />}></Button>
        </Dropdown>
    );
};

export default Action;
