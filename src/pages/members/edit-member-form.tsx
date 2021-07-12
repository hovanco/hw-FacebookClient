import { EditFilled } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Select } from 'antd';
import { map } from 'lodash';
import React, { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import staffApi from '../../api/staff-api';
import useModal from '../../hooks/use-modal';
import { updateStaff } from '../../reducers/staffState/staffAction';
import { IStaff } from '../../reducers/staffState/staffReducer';
import roles, { IRole } from './roles';

interface Props {
    staff: IStaff;
}

const EditMemberForm: FC<Props> = ({ staff }) => {
    const { visible, toggle } = useModal();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const reset = () => form.resetFields();
    const token = useSelector((state: any) => state.auth.token);
    const store = useSelector((state: any) => state.store.store);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const response = await staffApi.updateStaff({
                storeId: store._id,
                token: token.accessToken,
                staffId: staff._id,
                data: {
                    role: values.role,
                    name: values.name,
                },
            });

            dispatch(
                updateStaff({
                    _id: staff._id,
                    name: values.name,
                    role: values.role,
                })
            );

            setLoading(false);
            message.success('Chỉnh sửa nhân viên thành công');
            toggle();
        } catch (error) {
            setLoading(false);
            message.error('Lỗi chỉnh sửa nhân viên');
        }
    };

    const closeModal = () => {
        toggle();
        reset();
    };

    return (
        <>
            <Button icon={<EditFilled />} onClick={toggle} style={{ marginLeft: '10px' }} />

            <Modal
                visible={visible}
                onCancel={closeModal}
                title='Chỉnh sửa nhân viên'
                footer={null}
            >
                <Form layout='vertical' form={form} onFinish={onFinish}>
                    <Form.Item
                        label='Tên'
                        name='name'
                        initialValue={staff.name}
                        rules={[{ required: true, message: 'Điền tên nhân viên' }]}
                    >
                        <Input placeholder='Tên nhân viên' />
                    </Form.Item>

                    <Form.Item
                        label='Vị trí'
                        name='role'
                        initialValue={staff.role}
                        rules={[
                            {
                                required: true,
                                message: 'Chọn vị trí cho nhân viên',
                            },
                        ]}
                    >
                        <Select placeholder='Chọn vị trí'>
                            {map(roles, (role: IRole) => (
                                <Select.Option value={role.id} key={role.id}>
                                    {role.title}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType='button' onClick={closeModal} style={{ marginRight: 15 }}>
                            Hủy
                        </Button>
                        <Button type='primary' htmlType='submit' loading={loading}>
                            Lưu
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default EditMemberForm;
