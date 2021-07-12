import { message, Select } from 'antd';
import { map } from 'lodash';
import React, { FC, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import staffApi from '../../api/staff-api';
import { updateStaff } from '../../reducers/staffState/staffAction';
import { IStaff } from '../../reducers/staffState/staffReducer';
import roles from './roles';

interface Props {
    staff: IStaff;
}

const ChangeRole: FC<Props> = ({ staff }): JSX.Element => {
    const [loading, setLoading] = useState(false);
    const token = useSelector((state: any) => state.auth.token);
    const store = useSelector((state: any) => state.store.store);
    const dispatch = useDispatch();

    const changRoleStaff = async (value: any) => {
        setLoading(true);
        try {
            const reponse = await staffApi.updateStaff({
                staffId: staff._id,
                storeId: store._id,
                data: {
                    role: value,
                },
                token: token.accessToken,
            });
            setLoading(false);
            dispatch(updateStaff({ _id: staff._id, role: value }));
            message.success('Đã cập nhật vị trí');
        } catch (error) {
            setLoading(false);
            message.error('Lỗi cập nhật vị trí');
        }
    };

    return (
        <Select onChange={changRoleStaff} value={staff.role} loading={loading}>
            {map(roles, (role: any) => (
                <Select.Option key={role.id} value={role.id}>
                    {role.title}
                </Select.Option>
            ))}
        </Select>
    );
};

export default ChangeRole;
