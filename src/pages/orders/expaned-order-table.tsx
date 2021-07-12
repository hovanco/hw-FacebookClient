import React, { FC } from 'react';
import { IProduct, IOrder } from './interface';
import { Avatar, Table, Tag } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import formatMoney from '../../utils/format-money';
import { ColumnsType } from 'antd/lib/table';

interface Props {
    order: IOrder;
}

const ExpanedOrderTable: FC<Props> = ({ order }): JSX.Element => {
    const columns: ColumnsType<IProduct> | undefined = [
        {
            title: 'Ảnh',
            dataIndex: 'img',
            render: (img: string) => {
                if (!img) return <Avatar icon={<PictureOutlined />} shape='square' />;
                return <Avatar src={img} shape='square' />;
            },
        },
        { title: 'Tên', dataIndex: 'name', key: 'name' },
        { title: 'Khối lượng (g)', dataIndex: 'weight', key: 'weight' },
        { title: 'Số lượng', dataIndex: 'quanlity', key: 'quanlity' },

        {
            title: 'Đơn giá(VND)',
            dataIndex: 'price',
            key: 'proce',
            render: (price: number) => formatMoney(price),
        },
        {
            title: 'SL trong kho',
            dataIndex: 'quantity_in_stock',
            key: 'quantity_in_stock',
            align: 'center',
            render: (quantity_in_stock) => {
                return <Tag color='cyan'>Còn hàng {quantity_in_stock}</Tag>;
            },
        },
        { title: '', dataIndex: '', key: 'action', render: () => <div /> },
    ];

    const dataSource = order.list_orders.map((o: IProduct) => ({
        ...o,
        key: o.id,
    }));

    return <Table columns={columns} pagination={false} dataSource={dataSource} />;
};

export default ExpanedOrderTable;
