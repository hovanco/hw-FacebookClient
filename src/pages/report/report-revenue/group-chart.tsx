import { Card, Col, Empty, Row } from 'antd';
import React, { FC } from 'react';

import { Loading } from '../../../components';
import Chart from './chart';
import { useReportRevenueContext } from './context';

const GroupChart: FC = (): JSX.Element => {
    const { data, loading } = useReportRevenueContext();

    const chartTotalRender = () => {
        if (loading)
            return (
                <div className='card-empty'>
                    <Loading full />
                </div>
            );
        if (data.length === 0)
            return (
                <div className='card-empty'>
                    <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />
                </div>
            );

        const total = data.reduce((value: number, o: any) => o.total + value, 0);

        const data_total = data.map((d: any) => {
            return {
                name: d.products[0].name,
                y: (d.total / total) * 100,
            };
        });

        return (
            <Chart
                data={data_total}
                name='Số lượng'
                title_text='Báo cáo số lượng'
                tooltip='số lượng'
            />
        );
    };

    const chartMoneyRender = () => {
        if (loading)
            return (
                <div className='card-empty'>
                    <Loading full />
                </div>
            );
        if (data.length === 0)
            return (
                <div className='card-empty'>
                    <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />
                </div>
            );

        const total = data.reduce(
            (value: number, o: any) => o.total * o.products[0].price + value,
            0
        );

        const data_money = data.map((d: any) => {
            return {
                name: d.products[0].name,
                y: ((d.total * d.products[0].price) / total) * 100,
            };
        });

        return (
            <Chart
                data={data_money}
                name='Doanh thu'
                title_text='Báo cáo doanh thu'
                tooltip='doanh thu'
            />
        );
    };

    return (
        <Row gutter={20} style={{ marginTop: 20, marginBottom: 20 }}>
            <Col md={12}>
                <Card>{chartTotalRender()}</Card>
            </Col>

            <Col md={12}>
                <Card>{chartMoneyRender()}</Card>
            </Col>
        </Row>
    );
};

export default GroupChart;
