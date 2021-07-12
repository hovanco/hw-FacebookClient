import React from 'react';
import {
    AppstoreFilled,
    CheckCircleFilled,
    PrinterFilled,
    CarFilled,
    DollarCircleFilled,
    StopFilled,
} from '@ant-design/icons';

interface Tab {
    key: number | string;
    title: string;
    icon: JSX.Element;
    component: JSX.Element;
}

const tabs: Tab[] = [
    {
        key: 'all',
        title: 'Tất cả',
        icon: <AppstoreFilled />,
        component: <div />,
    },
    {
        key: 1,
        title: 'Xác nhận',
        icon: <CheckCircleFilled />,
        component: <div />,
    },
    {
        key: 2,
        title: 'In & Đóng gói',
        icon: <PrinterFilled />,
        component: <div />,
    },
    {
        key: 3,
        title: 'Đang chuyển',
        icon: <CarFilled />,
        component: <div />,
    },
    {
        key: 5,
        title: 'Thanh toán',
        icon: <DollarCircleFilled />,
        component: <div />,
    },
    {
        key: 4,
        title: 'Hủy hàng',
        icon: <StopFilled />,
        component: <div />,
    },
];

export default tabs;
