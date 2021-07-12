import { Button, Form, Input, Modal } from 'antd';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import useModal from '../../../hooks/use-modal';
import { createGallery } from '../../../reducers/imagesState/imagesAction';

const AddCategoryImg = (): JSX.Element => {
    const [loading, setLoading] = useState(false);
    const { visible, toggle } = useModal();

    const dispatch = useDispatch();

    const onFinish = async (values: any) => {
        const { name } = values;
        if (name && name.trim().length > 0) {
            await setLoading(true);
            await dispatch(createGallery(name.trim()));
            await setLoading(false);
            toggle();
        }
    };

    return (
        <>
            <Button onClick={toggle}>Tạo danh mục</Button>
            <Modal
                title='Thêm danh mục ảnh'
                footer={null}
                onCancel={toggle}
                visible={visible}
                destroyOnClose
            >
                <Form onFinish={onFinish} layout='vertical'>
                    <Form.Item
                        name='name'
                        rules={[{ required: true, message: 'Điền tên thư mục ảnh' }]}
                    >
                        <Input placeholder='Điền tên thư mục ảnh' />
                    </Form.Item>
                    <Form.Item>
                        <Button loading={loading} htmlType='submit' type='primary'>
                            Thêm danh mục
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default AddCategoryImg;
