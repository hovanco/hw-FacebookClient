import { Card, Empty } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';

import CreateStoreForm from '../../create-store/create-store-form';

const General = (): JSX.Element => {
    const store = useSelector((state: any) => state.store.store);

    const renderContent = () => {
        if (store && store) {
            return (
                <div style={{ maxWidth: 768, margin: '30px auto' }}>
                    <CreateStoreForm />
                </div>
            );
        }

        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    };

    return (
        <Card type='inner' title='Cửa hàng'>
            {renderContent()}
        </Card>
    );
};

export default General;
