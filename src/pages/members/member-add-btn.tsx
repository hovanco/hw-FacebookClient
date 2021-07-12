import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import React, { useState } from 'react';

import MemberAddForm from './member-add-form';

const MembersAddBtn = ({ size }: { size: string }): JSX.Element => {
    const [visible, setVisible] = useState(false);
    const toggle = () => setVisible(!visible);

    return (
        <>
            <Button onClick={toggle} type='primary'>
                <PlusOutlined /> Thêm
            </Button>
            <Modal
                title='Thêm nhân viên'
                visible={visible}
                onCancel={toggle}
                footer={null}
                destroyOnClose
            >
                <MemberAddForm toggle={toggle} />
            </Modal>
        </>
    );
};

export default MembersAddBtn;
