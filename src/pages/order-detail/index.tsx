import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Tabs } from 'antd';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import { BaseLayout } from '../../layout';
import { useNotification } from '../customer/notfication-context';
import { ProviderContextOrder } from './context';
import FormUpdateOrder from './form-update-order';

const { TabPane } = Tabs;

const OrderDetail: FC = (): JSX.Element => {
    const { title } = useNotification();
    function callback() {}

    const title_page = `${title} Chi tiết đơn hàng`;

    return (
        <BaseLayout title={title_page}>
            <ProviderContextOrder>
                <Tabs
                    defaultActiveKey='1'
                    onChange={callback}
                    tabBarExtraContent={
                        <Link to='/customer/order'>
                            <Button icon={<ArrowLeftOutlined />} style={{ marginRight: 10 }} />
                            Quay lại
                        </Link>
                    }
                    tabBarStyle={{ padding: '0 15px', background: '#fff' }}
                >
                    <TabPane tab='Chi tiết đơn hàng' key='1'>
                        <FormUpdateOrder />
                    </TabPane>
                    {/* <TabPane tab="Lịch sử đơn hàng" key="2">
                    Lịch sử đơn hàng
                </TabPane> */}
                </Tabs>
            </ProviderContextOrder>
        </BaseLayout>
    );
};

export default OrderDetail;
