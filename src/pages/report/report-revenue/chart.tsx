import React, { FC } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface Props {
    data: any;
    title_text?: string;
    subtitle_text?: string;
    tooltip?: string;
    name?: string;
}

const Chart: FC<Props> = ({
    data,
    title_text = '',
    subtitle_text = '',
    name = '',
}): JSX.Element => {
    const options = {
        chart: {
            type: 'pie',
        },
        title: {
            text: title_text,
        },
        subtitle: {
            text: subtitle_text,
        },

        accessibility: {
            announceNewData: {
                enabled: true,
            },
            point: {
                valueSuffix: '%',
            },
        },

        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '{point.name}: {point.y:.1f}%',
                },
            },
        },

        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: `<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b><br/>`,
        },

        series: [
            {
                name,
                colorByPoint: true,
                data: [...data],
            },
        ],
    };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default Chart;
