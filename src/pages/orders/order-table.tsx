import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { push } from 'connected-react-router';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, setOrders } from '../../reducers/orderState/orderAction';
import formatMoney from '../../utils/format-money';
import Action from './action';
import ChangeStatus from './change-status';
import ExpanedOrderTable from './expaned-order-table';
import { IOrder } from './interface';
import ShipStatus from './ship-status';

const LIMIT = 20;

export const getValue = (products: any, type: string) => {
    return products.reduce(
        (value: number, p: any) => (p.productId ? p.productId[type] : 0) * p.count + value,
        0
    );
};

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
        title: <span className='th'>Người tạo</span>,
        dataIndex: 'createdBy',
        key: 'createdBy',
        render: (createdBy: any) => {
            if (!createdBy) return null;

            const color = createdBy.role === 'admin' ? '#f50' : '#108ee9';
            const text = createdBy.role === 'admin' ? 'Chủ shop' : 'Nhân viên';

            return (
                <>
                    {createdBy.name}
                    {/* <br />
                    <Tag color={color}>{text}</Tag> */}
                </>
            );
        },
    },
    {
        title: <span className='th'>KL(g)</span>,
        dataIndex: 'products',
        key: 'weight',
        sorter: (a, b) => getValue(a.products, 'weight') - getValue(b.products, 'weight'),

        render: (products: any) => getValue(products, 'weight'),
    },
    {
        title: <span className='th'>Tổng tiền(VND)</span>,
        dataIndex: 'totalPrice',
        key: 'totalPrice',
        sorter: (a, b) => a.totalPrice - b.totalPrice,

        render: (totalPrice: number) => formatMoney(totalPrice),
    },
    {
        title: <span className='th'>Trạng thái</span>,
        dataIndex: 'status',
        key: 'trang_thai',
        render: (status: any, record: { _id: string }) => {
            return <ChangeStatus status={status} orderId={record._id} />;
        },
    },

    {
        title: <span className='th'>Vận chuyển</span>,
        dataIndex: 'deliveryOptions',
        key: 'ship',
        render: ({ serviceId }: { serviceId?: number }) => {
            return <ShipStatus ship={serviceId} />;
        },
    },
    {
        title: <span className='th'>Chênh lệch PVC(VND)</span>,
        dataIndex: 'deliveryOptions',
        sorter: (a, b) => {
            const value1 = a.deliveryOptions.shipmentFeeForCustomer - a.deliveryOptions.shipmentFee;
            const value2 = b.deliveryOptions.shipmentFeeForCustomer - b.deliveryOptions.shipmentFee;
            return value1 - value2;
        },
        key: 'xx',
        render: ({
            shipmentFee,
            shipmentFeeForCustomer,
        }: {
            shipmentFee: any;
            shipmentFeeForCustomer: any;
        }) => {
            return formatMoney(shipmentFeeForCustomer - shipmentFee);
        },
    },
    {
        title: '',
        align: 'center',
        dataIndex: '_id',
        key: 'action',
        render: (_, order: IOrder) => <Action order={order} />,
    },
];

const OrderTable = (): JSX.Element => {
    const dispatch = useDispatch();
    const type = useSelector(({ order }: { order: any }) => order.type);
    const loading = useSelector(({ order }: { order: any }) => order.loading);
    const orders = useSelector(({ order }: { order: any }) => order.orders.data);
    const total = useSelector(({ order }: { order: any }) => order.orders.total);

    useEffect(() => {
        const dataPost: any = { page: 1, limit: LIMIT };

        if (type && type !== 'all') {
            dataPost.status = type;
            dispatch(fetchOrders(dataPost));
        } else {
            dispatch(fetchOrders({ page: 1, limit: LIMIT }));
        }

        return () => {
            dispatch(setOrders({ data: [], total: 0 }));
        };
    }, [type]);

    const dataSource = orders.map((o: any) => ({ ...o, key: o._id }));

    const rowSelection = {
        onChange: (selectedRowKeys: any, selectedRows: any) => {
            // setSelectOrder(selectedRows);
        },
        getCheckboxProps: (record: any) => ({
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name,
        }),
    };

    const expandedRowRender = (record: any) => {
        return <ExpanedOrderTable order={record} />;
    };

    const onChangePage = (page: number, pageSize?: number | undefined) => {
        dispatch(fetchOrders({ page, limit: pageSize || LIMIT }));
    };

    return (
        <div className='table-content'>
            <Table
                dataSource={dataSource}
                columns={columns}
                //  rowSelection={rowSelection}
                loading={loading}
                className='orders-table'
                onRow={(record) => {
                    return {
                        onClick: (event) => {
                            if (
                                (event.target as any).className &&
                                (event.target as any).className === 'ant-table-cell'
                            ) {
                                dispatch(push(`/customer/order/${record._id}`));
                            }
                        },
                    };
                }}
                pagination={{
                    onChange: onChangePage,
                    total,
                    pageSize: LIMIT,
                }}
                rowKey='_id'
            />
        </div>
    );
};

export default OrderTable;
