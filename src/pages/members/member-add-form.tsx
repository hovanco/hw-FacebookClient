import { Button, Form, Input, Select, message } from 'antd';
import { Store } from 'antd/lib/form/interface';
import { map, get } from 'lodash';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import staffApi from '../../api/staff-api';
import { loadStaffs } from '../../reducers/staffState/staffAction';
import roles, { IRole } from './roles';

const { Password } = Input;

interface IProps {
    toggle: () => void;
}

function MemberAddForm({ toggle }: IProps): JSX.Element {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const [isFullUser, setIsFullUser] = useState(false);
    const reset = () => form.resetFields();
    const token = useSelector((state: any) => state.auth.token);
    const store = useSelector((state: any) => state.store.store);

    const onFinish = async (values: Store) => {
        setLoading(true);
        try {
            const response = await staffApi.createStaff({
                data: {
                    email: values.email,
                    password: values.password,
                    role: values.role,
                    name: values.name,
                },
                storeId: store._id,
                token: token.accessToken,
            });
            dispatch(loadStaffs());

            setLoading(false);
            message.success('Thêm nhân viên thành công');
            reset();
            toggle();
        } catch (error) {
            setLoading(false);
            if (get(error, 'response.status') === 409) {
                message.error('Email đã tồn tại trong hệ thống');
            } else {
                message.error('Lỗi thêm nhân viên');
            }
        }
    };

    if (isFullUser) {
        return (
            <div>
                <p>
                    Tài khoản của bạn đã thành viên. Để có thể thêm thành viên bạn có thể nâng cấp
                    lên gói dịch vụ cao hơn.
                </p>
            </div>
        );
    }

    return (
        <Form layout='vertical' form={form} onFinish={onFinish}>
            <Form.Item
                label='Tên'
                name='name'
                rules={[{ required: true, message: 'Điền tên nhân viên' }]}
            >
                <Input placeholder='Tên nhân viên' />
            </Form.Item>
            <Form.Item
                label='Email'
                name='email'
                rules={[
                    { required: true, message: 'Điền email nhân viên' },
                    {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                    },
                ]}
            >
                <Input placeholder='Email nhân viên' />
            </Form.Item>
            <Form.Item
                label='Mật khẩu'
                name='password'
                rules={[{ required: true, message: 'Điền mật khẩu' }]}
            >
                <Password placeholder='Điền mật khẩu' />
            </Form.Item>
            <Form.Item
                label='Vị trí'
                name='role'
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
                <Button htmlType='button' onClick={toggle} style={{ marginRight: 15 }}>
                    Hủy
                </Button>
                <Button type='primary' htmlType='submit' loading={loading}>
                    Thêm
                </Button>
            </Form.Item>
        </Form>
    );
}

export default MemberAddForm;
