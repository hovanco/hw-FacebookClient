import { EllipsisOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Modal } from 'antd';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeOrdersDraft } from '../../reducers/orderDraftState/orderDraftAction';
import { removeOrders } from '../../reducers/orderState/orderAction';
import { IOrder } from './interface';

interface Props {
    order: IOrder;
}

const Action: FC<Props> = ({ order }): JSX.Element => {
    const dispatch = useDispatch();

    const onRemoveOrder = () => {
        if (order.isDraft) {
            dispatch(removeOrdersDraft(order._id));
        } else {
            dispatch(removeOrders(order._id));
        }
    };

    const showConfirm = () => {
        Modal.confirm({
            title: 'Xóa Đơn Hàng?',
            content: `Bạn chắc chắn muốn xóa đơn hàng?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                onRemoveOrder();
            },
        });
    };

    const menu = (
        <Menu>
            <Menu.Item key='0'>
                <Link to={`/customer/${order.isDraft ? 'order-draft' : 'order'}/${order._id}`}>
                    Sửa
                </Link>
            </Menu.Item>
            <Menu.Item key='1'>In</Menu.Item>

            <Menu.Item key='2' onClick={showConfirm}>
                Xóa
            </Menu.Item>
        </Menu>
    );
    return (
        <Dropdown overlay={menu} trigger={['click']}>
            <Button icon={<EllipsisOutlined />} />
        </Dropdown>
    );
};

export default Action;
