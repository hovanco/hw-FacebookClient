import { Card, Empty } from 'antd';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment';
import React, { FC, memo } from 'react';

import TableChart from './table';
import { useReportConversationContext } from './context';

const Chart: FC = (): JSX.Element => {
    const { date, data, loading, type } = useReportConversationContext();

    const renderContent = () => {
        if (!data) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

        const { header, items } = data;

        const year = (): string => {
            if (type === 'custom') {
                return moment((date as any[])[0]).format('YYYY');
            }
            return moment(date).format('YYYY');
        };

        const getDate = (): string[] => {
            return header.map((o: string) => {
                return `${o}/${year()}`;
            });
        };

        const series = items.map((o: any) => {
            return {
                name: o.displayName,
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

                <TableChart data={data} />
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
