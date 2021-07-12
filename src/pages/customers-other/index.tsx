import React from 'react';

import { BaseLayout } from '../../layout';
import { useNotification } from '../customer/notfication-context';
import { ProviderCustomerContext } from './context';
import CustomersTable from './customers-table';
import HeaderRight from '../../components/header-customer/header-right';
import './style.less';

const text = 'Khách hàng';

function Customers(): JSX.Element {
    const { title } = useNotification();
    const title_page = `${title} ${text}`;
    return (
        <BaseLayout title={title_page}>
            <ProviderCustomerContext>
                <div className='member-wrap main'>
                    <HeaderRight title={text} />
                    <div className='content-page content'>
                        <CustomersTable />
                    </div>
                </div>
            </ProviderCustomerContext>
        </BaseLayout>
    );
}

export default Customers;
