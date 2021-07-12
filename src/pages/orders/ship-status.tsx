import { Tag, Tooltip } from 'antd';
import React, { FC } from 'react';

const ships: any = {
    2: {
        id: 'GHN',
        title: 'Giao hàng nhanh',
        color: '#FF8216',
    },
    1: {
        id: 'GHTK',
        title: 'Giao hàng tiết kiệm',
        color: '#11924B',
    },
};

interface Props {
    ship?: number;
}

const ShipStatus: FC<Props> = ({ ship }): JSX.Element => {
    if (!ship) {
        return (
            <Tooltip title='Tự vận chuyển'>
                <Tag>TVC</Tag>
            </Tooltip>
        );
    }

    return (
        <span>
            <Tooltip title={ships[ship].title}>
                <Tag color={ships[ship].color}>{ships[ship].id}</Tag>
            </Tooltip>
        </span>
    );
};

export default ShipStatus;
