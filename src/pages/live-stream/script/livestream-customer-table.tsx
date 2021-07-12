import { Avatar, Col, Row, Space, Table } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import { pick, get } from 'lodash';
import moment from 'moment';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { ILivestreamScript } from '../../../collections/livestream-script';
import { IFacebookState } from '../../../reducers/fanpageState/fanpageReducer';
import { generateUrlImgFb } from '../../../utils/generate-url-img-fb';
import ViewOrderDetail from './view-order-detail';

interface Props {
    customers: any[];
    script: ILivestreamScript;
    total: number;
    loading: boolean;
    page: number;
    pageSize: number;
    onChangeTable: (pagination: TablePaginationConfig) => void;
    reloadCustomer: () => void;
}

const LivestreamCustomerTable: FC<Props> = ({
    customers,
    total,
    loading,
    script,
    page,
    pageSize,
    onChangeTable,
    reloadCustomer,
}) => {
    const pages = useSelector(({ fanpage }: { fanpage: IFacebookState }) => fanpage.pages);
    const pageExist = Object.keys(pages)
        .map((key: string) => pages[key])
        .find((page: any) => page.fbObjectId === script.fbPageId);

    const columns: ColumnsType<any> = [
        {
            title: 'Khách hàng',
            dataIndex: '',
            key: 'name',
            render: (customer: any) => {
                return (
                    <Space size={5}>
                        <Avatar
                            src={generateUrlImgFb(customer.fbUserId, get(pageExist, 'accessToken'))}
                        />
                        {customer.fbUserName}
                    </Space>
                );
            },
        },
        {
            title: 'Bình luận',
            dataIndex: '',
            width: 200,
            key: 'comments',
            className: 'b-r-none custome-row',
            render: (customer: any) => {
                return {
                    children: customer.comments.map((comment: any) => {
                        return (
                            <Row className='comment' key={comment._id}>
                                <Col style={{ width: 200 }}>{comment.message}</Col>
                                <Col style={{ width: 170 }}>
                                    {comment.phoneNo || get(customer, 'customer.phoneNo') || '---'}
                                </Col>
                                <Col style={{ flex: 1 }}>
                                    {comment.address || get(customer, 'customer.province')
                                        ? [
                                              get(customer, 'customer.address'),
                                              get(customer, 'customer.wardName'),
                                              get(customer, 'customer.districtName'),
                                              get(customer, 'customer.provinceName'),
                                          ]
                                              .filter((text) => !!text)
                                              .join(', ')
                                        : '---'}
                                </Col>
                                <Col style={{ width: 146 }}>
                                    {moment(comment.createdAt).format('DD/MM/YYYY HH:mm')}
                                </Col>
                            </Row>
                        );
                    }),
                    props: {
                        colSpan: 4,
                    },
                };
            },
        },
        {
            title: 'Số điện thoại',
            className: 'b-r-none',
            dataIndex: '',
            key: 'phoneNo',
            width: 170,
            render: (value, row, index) => {
                const obj = {
                    children: value,
                    props: { rowSpan: 0 },
                };

                return obj;
            },
        },
        {
            title: 'Địa chỉ',
            dataIndex: '',
            className: 'b-r-none',
            key: 'address',
            render: (value, row, index) => {
                const obj = {
                    children: value,
                    props: { rowSpan: 0 },
                };

                return obj;
            },
        },
        {
            title: 'Thời gian',
            dataIndex: '',

            key: 'time',
            width: 150,
            render: (value, row, index) => {
                const obj = {
                    children: value,
                    props: { rowSpan: 0 },
                };

                return obj;
            },
        },
        {
            title: 'Đơn hàng',
            dataIndex: '',
            key: 'orderId',
            align: 'center',
            width: 150,
            render: (customer: any) => {
                return (
                    <ViewOrderDetail
                        fbPageId={script.fbPageId}
                        orderId={customer.orderId}
                        scriptId={script._id}
                        customer={{
                            ...pick(customer, ['fbUserId', 'fbUserName']),
                            phoneNo:
                                customer.comments[customer.comments.length - 1].phoneNo ||
                                get(customer, 'customer.phoneNo'),
                            province: get(customer, 'customer.province'),
                            district: get(customer, 'customer.district'),
                            ward: get(customer, 'customer.ward'),
                            address: get(customer, 'customer.address'),
                        }}
                        reloadCustomer={reloadCustomer}
                    />
                );
            },
        },
    ];



    return (
        <div style={{ marginLeft: -1, marginRight: -1 }}>
            <Table
                style={{ border: 'none' }}
                loading={loading}
                dataSource={customers}
                columns={columns}
                rowKey={(item) => get(item, 'comments[0]._id')}
                bordered
                className='livestream-customer'
                pagination={false}
                footer={() => {
                    const startNumber = 1 + (page - 1) * pageSize;
                    const endNumber =
                        page * pageSize > customers.length ? customers.length : page * pageSize;
                    return (
                        <span>{`Hiển thị kết quả từ ${startNumber} - ${endNumber} trong tổng ${total}`}</span>
                    );
                }}
            />
        </div>
    );
};

export default LivestreamCustomerTable;
