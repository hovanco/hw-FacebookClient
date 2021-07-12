import React, { FC } from 'react';
import { Table } from 'antd';
import formatMoney from '../../utils/format-money';
import { getFee } from '../conversation/conversation-customer/util';

interface Props {
    order: any;
}

const TotalOrder: FC<Props> = ({ order }) => {
    const columns: any = [
        {
            title: <b style={{ fontSize: 12 }}>Số SP</b>,
            dataIndex: 'total',
            key: 'total',
            render: (value: number) => <b style={{ color: 'green' }}>{value}</b>,
        },
        {
            title: <b style={{ fontSize: 12 }}>KL</b>,
            dataIndex: 'weight',
            key: 'weight',
            render: (value: number) => <b style={{ color: 'green' }}>{value}</b>,
        },

        {
            title: <b style={{ fontSize: 12 }}>Thu người nhận</b>,
            dataIndex: '',
            key: 'feeForReceiver',
            render: () => (
                <b style={{ color: 'green' }}>{formatMoney(getFee(order).feeForReceiver)}</b>
            ),
        },
        {
            title: <b style={{ fontSize: 12 }}>Trả người gửi</b>,
            dataIndex: '',
            key: 'moneyForSender',
            render: () => (
                <b style={{ color: 'green' }}>{formatMoney(getFee(order).moneyForSender)}</b>
            ),
        },
    ];

    const dataSource = [
        {
            key: 1,
            total: order.products.reduce((value: number, o: any) => value + o.count, 0),
            weight: order.products.reduce(
                (value: number, o: any) => value + o.productId.weight * o.count,
                0
            ),
            money: order.products.reduce((value: number, o: any) => value + o.price * o.count, 0),
        },
    ];

    return (
        <Table bordered pagination={false} size='small' columns={columns} dataSource={dataSource} />
    );
};

export default TotalOrder;
