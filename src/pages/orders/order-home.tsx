import { Tabs } from 'antd';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { BaseLayout } from '../../layout';
import { changeOrderType } from '../../reducers/orderState/orderAction';
import { useNotification } from '../customer/notfication-context';
import OrderTable from './order-table';
import tabs from './tabs';
import HeaderRight from '../../components/header-customer/header-right';

const { TabPane } = Tabs;

const text = 'Đơn hàng';

const Orders: FC = (): JSX.Element => {
    const { title } = useNotification();
    const dispatch = useDispatch();
    function callback(key: any) {
        dispatch(changeOrderType(key));
    }
    const title_page = `${title} ${text}`;
    return (
        <BaseLayout title={title_page}>
            <HeaderRight title='Đơn Hàng' />
            <div className='content'>
                <Tabs
                    defaultActiveKey='all'
                    onChange={callback}
                    tabBarStyle={{ padding: '0 15px', background: '#fff' }}
                >
                    {tabs.map((tab) => {
                        return (
                            <TabPane
                                tab={
                                    <span>
                                        {tab.icon}
                                        {tab.title}
                                    </span>
                                }
                                key={tab.key}
                            ></TabPane>
                        );
                    })}
                </Tabs>
                <OrderTable />
            </div>
        </BaseLayout>
    );
};

export default Orders;
