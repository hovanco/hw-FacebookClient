import React, { FC } from 'react';

import { BaseLayout } from '../../layout';
import { useNotification } from '../customer/notfication-context';
import WarehousesTable from './warehouses-table';
import HeaderRight from '../../components/header-customer/header-right';

const text = 'Chi nhánh';

const Warehouses: FC = (): JSX.Element => {
    const { title } = useNotification();
    const title_page = `${title} ${text}`;
    return (
        <BaseLayout title={title_page}>
            <div className='main'>
                <HeaderRight title={text} />
                <div className='content'>
                    <WarehousesTable />
                </div>
            </div>
        </BaseLayout>
    );
};

export default Warehouses;
