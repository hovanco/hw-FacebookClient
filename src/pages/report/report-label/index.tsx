import { Alert } from 'antd';
import React, { FC } from 'react';

import { BaseLayout } from '../../../layout';
import { useNotification } from '../../customer/notfication-context';
import Chart from './chart';
import { ProviderReportLabel } from './context';
import Filter from './filter';
import HeaderRight from '../../../components/header-customer/header-right';

const text = 'Nhãn hội thoại';

const ReportLabel: FC = (): JSX.Element => {
    const { title } = useNotification();
    const title_page = `${title} ${text}`;
    return (
        <ProviderReportLabel>
            <BaseLayout title={title_page}>
                <HeaderRight title={text} />
                <div className='content'>
                    <Filter />

                    <Chart />

                    <Alert
                        style={{ marginTop: 15 }}
                        message='Chú ý:'
                        description={
                            <>
                                <p>- Số lượt nhãn gắn sẽ tính theo thời gian của từng ngày.</p>
                                <p>- Nhấn vào tên nhãn để ẩn hoặc hiển thị các đường biểu đồ</p>
                            </>
                        }
                        type='info'
                        showIcon
                    />
                </div>
            </BaseLayout>
        </ProviderReportLabel>
    );
};

export default ReportLabel;
