import { Alert } from 'antd';
import React, { FC } from 'react';

import { BaseLayout } from '../../../layout';
import { useNotification } from '../../customer/notfication-context';
import { ProviderReportRevenue } from './context';
import Filter from './filter';
import GroupChart from './group-chart';
import HeaderRight from '../../../components/header-customer/header-right';

const text = 'Doanh thu';

const ReportRevenue: FC = (): JSX.Element => {
    const { title } = useNotification();
    const title_page = `${title} ${text}`;
    return (
        <ProviderReportRevenue>
            <BaseLayout title={title_page}>
                <HeaderRight title={text} />
                <div className='content'>
                    <Filter />
                    <GroupChart />

                    <Alert
                        message='Chú ý:'
                        description={
                            <>
                                <p>Báo cáo doanh thu - số lượng của từng sản phẩm theo thời gian</p>
                            </>
                        }
                        type='info'
                        showIcon
                    />
                </div>
            </BaseLayout>
        </ProviderReportRevenue>
    );
};

export default ReportRevenue;
