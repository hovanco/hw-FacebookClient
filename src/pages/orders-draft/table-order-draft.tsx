import { Table, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { push } from 'connected-react-router';
import moment from 'moment';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LIMIT } from '.';
import { loadOrdersDraft } from '../../reducers/orderDraftState/orderDraftAction';
import formatMoney from '../../utils/format-money';
import Action from '../orders/action';
import { getValue } from '../orders/order-table';

const columns: ColumnsType<any> | undefined = [
    {
        title: <span className='th'>Ngày</span>,
        dataIndex: 'createdAt',
        key: 'createdAt',
        sorter: (a, b) => moment(a.createdAt).valueOf() - moment(b.createdAt).valueOf(),
        render: (createdAt: Date) => (
            <>
                {moment(createdAt).format('HH:mm')}
                <br />
                {moment(createdAt).format('DD/MM/YYYY')}
            </>
        ),
    },

    {
        title: <span className='th'>Khách hàng</span>,
        dataIndex: 'customer',
        key: 'customer',
        sorter: (a, b) => a.customer.name.length - b.customer.name.length,
        render: (customer: any) => {
            return (
                <>
                    {customer.name}
                    <br />
                    {customer.phoneNo}
                </>
            );
        },
    },
    {
        title: <span className='th'>Mã</span>,
        dataIndex: 'code',
        key: 'code',
        render: (code: string) => <Tag>{code}</Tag>,
    },
    {
        title: <span className='th'>Tổng tiền(VND)</span>,
        dataIndex: 'totalPrice',
        key: 'totalPrice',
        sorter: (a, b) => a.totalPrice - b.totalPrice,
        render: (totalPrice: number) => formatMoney(totalPrice),
    },

    {
        title: <span className='th'>KL(g)</span>,
        dataIndex: 'products',
        key: 'weight',
        sorter: (a, b) => getValue(a.products, 'weight') - getValue(b.products, 'weight'),

        render: (products: any) => getValue(products, 'weight'),
    },

    {
        title: '',
        align: 'right',
        dataIndex: '',
        key: 'action',
        render: (order: any) => <Action order={order} />,
    },
];

const TableOrderDraft = () => {
    const loading = useSelector((state: any) => state.orderDraft.loading);
    const orders = useSelector((state: any) => state.orderDraft.orders);
    const dispatch = useDispatch();

    const onChangePage = (page: number, pageSize?: number | undefined) => {
        dispatch(loadOrdersDraft({ page, limit: pageSize || LIMIT }));
    };

    return (
        <Table
            loading={loading}
            columns={columns}
            className='orders-table'
            dataSource={orders.data}
            rowKey={(item) => item._id}
            onRow={(record) => {
                return {
                    onClick: (event) => {
                        if (
                            (event.target as any).className &&
                            (event.target as any).className === 'ant-table-cell'
                        ) {
                            dispatch(push(`/customer/order-draft/${record._id}`));
                        }
                    },
                };
            }}
            pagination={{
                onChange: onChangePage,
                total: orders.total,
                pageSize: LIMIT,
            }}
        />
    );
};

export default TableOrderDraft;
