import React, { FC, useState, useEffect } from 'react';
import { Select } from 'antd';
import { useDispatch } from 'react-redux';

import { dataStatus } from './data';
import { updateStatusOrders } from '../../reducers/orderState/orderAction';
import { map } from 'lodash';
interface Props {
    status: string;
    orderId: string;
}

const { Option } = Select;

const ChangeStatus: FC<Props> = ({ status, orderId }): JSX.Element => {
    const [value, setvalue] = useState(status);
    const dispatch = useDispatch();

    const onChange = (value: string) => {
        dispatch(updateStatusOrders(orderId, value));
        setvalue(value);
    };

    useEffect(() => {
        setvalue(status);
    }, [status]);

    return (
        <Select value={value} style={{ width: 120 }} onChange={onChange}>
            {map(dataStatus, (status: any) => {
                return (
                    <Option key={status.id} value={status.id}>
                        {status.title}
                    </Option>
                );
            })}
        </Select>
    );
};

export default ChangeStatus;
