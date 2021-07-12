import { Button } from 'antd';
import React, { FC } from 'react';

interface Props {
    createOrderShip: () => void;
    shipmentOrderId?: string;
    loading?: boolean;
    disabled?: boolean;
}

const CreateShipOrder: FC<Props> = ({
    createOrderShip,
    shipmentOrderId,
    loading = true,
    disabled = false,
}) => {
    const title = `${shipmentOrderId ? 'Hủy' : 'Tạo'} đơn giao hàng`;
    const danger = !!shipmentOrderId;

    return (
        <Button
            type='primary'
            danger={danger}
            size='small'
            onClick={createOrderShip}
            loading={loading}
            disabled={disabled}
        >
            {title}
        </Button>
    );
};

export default CreateShipOrder;
