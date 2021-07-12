import React, { FC } from 'react';

import { BaseLayout } from '../../layout';
import { useNotification } from '../customer/notfication-context';
import ProductsTable from './products-table';
import HeaderRight from '../../components/header-customer/header-right';

import './style.less';

const text = 'Sản phẩm';

const Products: FC = (): JSX.Element => {
    const { title } = useNotification();
    const title_page = `${title} ${text}`;
    return (
        <BaseLayout title={title_page}>
            <div className='main'>
                <HeaderRight title={text} />
                <div className='content'>
                    <ProductsTable />
                </div>
            </div>
        </BaseLayout>
    );
};

export default Products;
