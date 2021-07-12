import { Alert } from 'antd';
import React, { FC } from 'react';

import { BaseLayout } from '../../../layout';
import { useNotification } from '../../customer/notfication-context';
import Chart from './chart';
import { ProviderReportConversation } from './context';
import Filter from './filter';
import HeaderRight from '../../../components/header-customer/header-right';

const text = 'Tương tác';

const ReportConversation: FC = (): JSX.Element => {
    const { title } = useNotification();
    const title_page = `${title} ${text}`;
    return (
        <ProviderReportConversation>
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
                                <p>
                                    - Bình luận mới: Là tổng bình luận theo người trên tất các bài
                                    viết không bao gồm những bình luận con.
                                </p>
                                <p>
                                    - Inbox mới: Là tổng số người lần đầu inbox tới (Tính trên hệ
                                    thống Gpage).
                                </p>

                                <p>
                                    - Cột tổng Là tổng của tất cả các ngày đang xem tính theo dòng.
                                </p>
                            </>
                        }
                        type='info'
                        showIcon
                    />
                </div>
            </BaseLayout>
        </ProviderReportConversation>
    );
};

export default ReportConversation;
