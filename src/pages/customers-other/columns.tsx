import React from 'react';
import moment from 'moment';
import { ColumnProps } from 'antd/lib/table/Column';

import { Th } from '../../components';
import { Customer } from './types';
import Page from './page';

export default (customers: Customer[]): Array<ColumnProps<[]>> => [
    {
        title: <Th>Họ và tên</Th>,
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: <Th>Số điện thoại</Th>,
        dataIndex: 'phoneNo',
        key: 'phoneNo',
    },
    {
        title: <Th>Page</Th>,
        dataIndex: 'fbPageId',
        key: 'fbPageId',
        render: (fbPageId: string) => <Page pageId={fbPageId} />,
    },
    { title: <Th>Email</Th>, dataIndex: 'email', key: 'email' },
    { title: <Th>Địa chỉ</Th>, dataIndex: 'address', key: 'address' },

    {
        title: <Th>Ngày tạo</Th>,
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (createdAt: string) => moment(createdAt).format('HH:mm DD/MM/YYYY'),
    },
];
