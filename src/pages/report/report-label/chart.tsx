import { Card, Empty } from 'antd';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment';
import React, { FC, memo } from 'react';

import { useReportLabelContext } from './context';
import TableChart from './table';

const Chart: FC = (): JSX.Element => {
    const { date, data, loading, type } = useReportLabelContext();

    const renderContent = () => {
        if (!data) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

        const year = (): string => {
            if (type === 'custom') {
                return moment((date as any[])[0]).format('YYYY');
            }
            return moment(date).format('YYYY');
        };

        const getDate = (): string[] => {
            return data.table.header.map((o: string) => {
                return `${o}/${year()}`;
            });
        };

        const series = data.table.items.map((o: any) => {
            return {
                name: o.label.name,
                color: o.label.backgroundColor,
                data: o.days,
            };
        });

        const options = {
            title: { text: 'Biểu đồ' },
            subtitle: { text: 'Báo cáo từng ngày' },
            xAxis: { categories: getDate() },
            yAxis: { title: { text: 'Số lượng' } },
            series,
        };

        return (
            <>
                <HighchartsReact highcharts={Highcharts} options={options} />

                <TableChart data={data.table} />
            </>
        );
    };

    return (
        <Card bodyStyle={{ padding: 0 }} loading={loading}>
            {renderContent()}
        </Card>
    );
};

export default memo(Chart);
