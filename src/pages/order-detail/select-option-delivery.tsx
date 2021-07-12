import React, { useState } from 'react';
import { Radio } from 'antd';
import { get } from 'lodash';

interface Props {
    order: any;
    changeTypeDelivery: (order: any) => void;
    disabled?: boolean;
}

const options: any[] = [
    { value: 1, title: 'Tự giao hàng' },
    { value: 2, title: 'Hãng vận chuyển' },
];

const SelectOptionDelivery = ({
    order,
    changeTypeDelivery,
    disabled = false,
}: Props): JSX.Element => {
    const [value, setValue] = useState<number>(() => {
        const initialValue = get(order, 'deliveryOptions.serviceId');
        if (initialValue) return 2;
        return 1;
    });

    const onChange = (e: any) => {
        const serviceId =
            e.target.value === 1
                ? 0
                : order.deliveryOptions.serviceId === 0
                ? null
                : order.deliveryOptions.serviceId;

        const noteForDelivery =
            e.target.value === 1 ? undefined : order.deliveryOptions.noteForDelivery;
        const newOrder = {
            ...order,
            deliveryOptions: { ...order.deliveryOptions, serviceId, noteForDelivery },
        };

        setValue(e.target.value);

        changeTypeDelivery(newOrder);
    };

    return (
        <Radio.Group onChange={onChange} value={value} disabled={disabled}>
            {options.map((option: any) => (
                <Radio value={option.value} key={option.value}>
                    {option.title}
                </Radio>
            ))}
        </Radio.Group>
    );
};

export default SelectOptionDelivery;
