import React from 'react';
import { Form, Input, Button, DatePicker, Select } from 'antd';

import { Member, Shift } from './types';

const { TextArea } = Input;
const style = { marginBottom: 15 };

interface IProps {
    member: Member;
    toggle: any;
}

function FormEditMember({ member, toggle }: IProps): JSX.Element {
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);
    const [shifts, setShifts] = React.useState([]);

    const handleSubmit = () => {
        setLoading(true);
    };

    const onCancel = () => toggle();

    return (
        <Form onFinish={handleSubmit}>
            <Form.Item label='Tên' name='displayName' rules={[{ required: true }]} style={style}>
                <Input />
            </Form.Item>
            <Form.Item label='Họ và tên' name='fullname' rules={[{ required: true }]} style={style}>
                <Input />
            </Form.Item>
            <Form.Item label='Ca trực' name='shift' rules={[{ required: true }]} style={style}>
                <Select>
                    {shifts.map((shift: Shift) => (
                        <Select.Option key={shift.id} value={shift.id}>
                            {shift.name}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                label='Số điện thoại'
                name='phoneNumber'
                rules={[{ required: true }]}
                style={style}
            >
                <Input />
            </Form.Item>
            <Form.Item label='Ngày sinh' name='birthday' rules={[{ required: true }]} style={style}>
                <DatePicker />
            </Form.Item>
            <Form.Item label='Địa chỉ' name='address' rules={[{ required: true }]} style={style}>
                <TextArea />
            </Form.Item>
            <Form.Item>
                <Button style={{ marginRight: 15 }} onClick={onCancel}>
                    Hủy
                </Button>
                <Button type='primary' htmlType='submit' loading={loading} disabled={loading}>
                    Chỉnh sửa
                </Button>
            </Form.Item>
        </Form>
    );
}

export default FormEditMember;
