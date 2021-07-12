import React, { FC } from 'react';
import { Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import useModal from '../../../hooks/use-modal';
import FormAddLabel from './form-add-label';

const ModalAddLabel: FC = (): JSX.Element => {
    const { toggle, visible } = useModal();
    return (
        <>
            <Button icon={<PlusOutlined />} onClick={toggle} className='primary-icon'>
                Thêm nhãn hội thoại
            </Button>

            <Modal
                visible={visible}
                title='Thêm nhãn hội thoại'
                footer={null}
                onCancel={toggle}
                destroyOnClose
                wrapClassName='modal-update-label'
            >
                <FormAddLabel toggle={toggle} layout={[6, 18]} />
            </Modal>
        </>
    );
};

export default ModalAddLabel;
