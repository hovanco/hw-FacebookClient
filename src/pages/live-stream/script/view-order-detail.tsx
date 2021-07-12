import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Space } from 'antd';
import React, { FC, useState } from 'react';
import { SearchIcon } from '../../../assets/icon';
import useModal from '../../../hooks/use-modal';
import OrderDetail from './order-detail';

interface Props {
    orderId: string;
    customer: any;
    fbPageId: string;
    scriptId: string;
    reloadCustomer: () => void;
}

const ViewOrderDetail: FC<Props> = ({ orderId, customer, fbPageId, scriptId, reloadCustomer }) => {
    const { visible, toggle } = useModal();
    const [order_code, setOrderCode] = useState<string | null>(null);

    const title = (
        <Space>
            {orderId ? 'Chi tiết đơn hàng' : 'Tạo đơn hàng'}
            <span style={{ color: '#0872d7' }}>{order_code}</span>
        </Space>
    );

    return (
        <>
            <Button
                type='link'
                onClick={toggle}
                icon={orderId ? <SearchIcon /> : <PlusCircleOutlined />}
                style={{ color: '#0872d7' }}
            >
                {orderId ? ' Xem đơn hàng' : 'Tạo đơn hàng'}
            </Button>

            <Modal
                visible={visible}
                width={768}
                onCancel={toggle}
                title={title}
                footer={null}
                bodyStyle={{ paddingTop: 10 }}
                destroyOnClose
            >
                {visible && (
                    <OrderDetail
                        orderId={orderId}
                        customer={customer}
                        fbPageId={fbPageId}
                        scriptId={scriptId}
                        toggle={toggle}
                        setOrderCode={setOrderCode}
                        reloadCustomer={reloadCustomer}
                    />
                )}
            </Modal>
        </>
    );
};

export default ViewOrderDetail;
