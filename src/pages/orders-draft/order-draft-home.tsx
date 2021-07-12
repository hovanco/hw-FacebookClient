import React from 'react';
import HeaderRight from '../../components/header-customer/header-right';
import { BaseLayout } from '../../layout';
import { useNotification } from '../customer/notfication-context';
import TableOrderDraft from './table-order-draft';

interface Props {}
const text = 'Đơn nháp';

const OrderDraftHome = (props: Props) => {
    const { title } = useNotification();

    const title_page = `${title} ${text}`;

    return (
        <BaseLayout title={title_page}>
            <HeaderRight title={text} />
            <div className='main'>
                <div className='content'>
                    <TableOrderDraft />
                </div>
            </div>
        </BaseLayout>
    );
};

export default OrderDraftHome;
