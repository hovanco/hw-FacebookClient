import React from 'react';
import { Empty, Card, Button } from 'antd';
import './order-not-found.less';
import { Link } from 'react-router-dom';

const OrderNotFound = (): JSX.Element => {
    return (
        <div className='order-not-found'>
            <Card>
                <h3>Đơn hàng không tồn tại</h3>
                <Empty
                    description=''
                    image={Empty.PRESENTED_IMAGE_DEFAULT}
                    style={{ marginBottom: 30 }}
                />

                <Link to='/customer/order'>
                    <Button type='primary'>Quay lại</Button>
                </Link>
            </Card>
        </div>
    );
};

export default OrderNotFound;
