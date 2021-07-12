import { CloudSyncOutlined } from '@ant-design/icons';
import { Modal, Spin } from 'antd';
import React from 'react';

interface Props {
    visible: boolean;
}

const ModalLoadData = (props: Props) => {
    return (
        <Modal visible={props.visible} closable={false} footer={null}>
            <div style={{ display: 'grid', gridGap: 15, textAlign: 'center' }}>
                <CloudSyncOutlined style={{ fontSize: 50 }} />
                <div>
                    <h2>Đang đồng bộ dữ liệu</h2>
                    <p>Dữ liệu của bạn đang được đồng bộ, bạn vui lòng chờ trong giây lát </p>
                </div>

                <Spin size='large' />
            </div>
        </Modal>
    );
};

export default ModalLoadData;
