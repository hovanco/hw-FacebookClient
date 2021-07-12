import { Button, Drawer, Tooltip } from 'antd';
import React, { useState } from 'react';
import { CloseIcon } from '../../../assets/icon';
import { useNewLiveStream } from './context';
import Demo from './demo';
import { size } from './index';

interface Props {}

const BtnDemo = (props: Props) => {
    const [visible, setVisible] = useState(false);
    const showDemo = () => {
        setVisible(true);
    };
    const onClose = () => {
        setVisible(false);
    };

    const { livestream } = useNewLiveStream();

    const disabled = livestream.keywords.length === 0;

    if (disabled) {
        return (
            <Tooltip
                title='Chưa thể thực hiện chức năng này. Bạn vui lòng tạo ít nhất một mẫu nội dung đặt hàng để xem demo'
                placement='top'
            >
                <Button size={size} disabled>
                    Xem Demo
                </Button>
            </Tooltip>
        );
    }

    return (
        <>
            <Button size={size} type='primary' ghost onClick={showDemo}>
                Xem Demo
            </Button>

            <Drawer
                bodyStyle={{ padding: 0 }}
                width={874}
                placement='right'
                onClose={onClose}
                visible={visible}
                closable
                closeIcon={<CloseIcon />}
                maskClosable
                destroyOnClose
            >
                <Demo />
            </Drawer>
        </>
    );
};

export default BtnDemo;
