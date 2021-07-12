import { DeleteOutlined } from '@ant-design/icons';
import { Button, message, Modal } from 'antd';
import React, { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import staffApi from '../../api/staff-api';
import { deleteStaff } from '../../reducers/staffState/staffAction';
import { IStaff } from '../../reducers/staffState/staffReducer';

interface Props {
    staff: IStaff;
}

const MemberAddBtn: FC<Props> = ({ staff }) => {
    const [loading, setLoading] = useState(false);
    const token = useSelector((state: any) => state.auth.token);
    const store = useSelector((state: any) => state.store.store);
    const dispatch = useDispatch();

    const removeStaff = async () => {
        setLoading(true);

        try {
            const response = await staffApi.deleteStaff({
                storeId: store._id,
                staffId: staff._id,
                token: token.accessToken,
            });
            dispatch(deleteStaff(staff._id));
            setLoading(false);
            message.success('Đã xóa nhân viên');
        } catch (error) {
            setLoading(false);
            message.error('Lỗi xóa nhân viên');
        }
    };

    const showConfirm = () => {
        Modal.confirm({
            title: 'Xóa Nhân Viên?',
            content: `Bạn chắc chắn muốn xóa nhân viên?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                removeStaff();
            },
        });
    };

    return <Button icon={<DeleteOutlined />} onClick={showConfirm} loading={loading} />;
};

export default MemberAddBtn;
