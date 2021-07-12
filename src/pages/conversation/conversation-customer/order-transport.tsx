import { Button, Space } from 'antd';
import React, { FC, memo, useState, useEffect } from 'react';
import { useOrder } from './context-order';
import Shipping from './shipping';
import UseCarrier from './use-carrier';

interface Props {
    hasOrder?: boolean;
}

const OrderTransport: FC<Props> = ({ hasOrder = false }) => {
    const { order, setOrder } = useOrder();
    const [tab, setTab] = useState('use_transformer');

    useEffect(() => {
        if (hasOrder) {
            if (order.deliveryOptions.serviceId) {
                setTab('use_transformer');
            } else {
                setTab('use_carrier');
            }
        }
    }, [order.deliveryOptions.serviceId]);

    function callback(key: string) {
        setTab(key);
        const is3ndShipment = key === 'use_transformer';

        const newOrder = {
            ...order,
            use_transformer: is3ndShipment,
            deliveryOptions: {
                ...order.deliveryOptions,
                serviceId: is3ndShipment ? undefined : 0,
                transportType: undefined,
                noteForDelivery: undefined,
                shipmentFee: 0,
            },
        };

        setOrder(newOrder);
    }

    const notValid =
        typeof order.customer.province === 'undefined' ||
        typeof order.customer.district === 'undefined' ||
        typeof order.customer.ward === 'undefined' ||
        typeof order.warehouseId === 'undefined' ||
        order.products.length === 0;

    if (notValid) return <div />;

    return (
        <>
            <div style={{ paddingBottom: '12px' }}>Thông tin vận chuyển</div>
            <Space size={20}>
                <Button
                    onClick={() => callback('use_transformer')}
                    type={tab === 'use_transformer' ? 'primary' : 'default'}
                    style={{ height: 38 }}
                >
                    Gửi vận chuyển
                </Button>
                <Button
                    onClick={() => callback('use_carrier')}
                    type={tab === 'use_carrier' ? 'primary' : 'default'}
                    style={{ height: 38 }}
                >
                    Tự vận chuyển
                </Button>
            </Space>

            <div>
                {tab === 'use_transformer' && <Shipping />}

                <UseCarrier />
            </div>
        </>
    );
};

export default memo(OrderTransport);
