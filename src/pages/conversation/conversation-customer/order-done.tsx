import React, { FC, ReactElement } from 'react';
import { Button } from 'antd';

interface Props {
    toggleDone: () => void;
}

const height = 'calc(100vh - 50px - 45px - 80px - 80px)';

const OrderDone: FC<Props> = ({ toggleDone }): ReactElement => {
    return (
        <div
            style={{
                textAlign: 'center',
                padding: 15,
                height,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <div>
                <h3>Đã tạo đơn thành công</h3>
                <Button type='primary' size='large' onClick={toggleDone}>
                    Trở lại
                </Button>
            </div>
        </div>
    );
};

export default OrderDone;
