import { ReloadOutlined } from '@ant-design/icons';
import { Button, Col, Row, Table } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { loadStaffs } from '../../reducers/staffState/staffAction';
import { IStaff } from '../../reducers/staffState/staffReducer';
import ChangeRole from './change-role';
import EditMemberForm from './edit-member-form';
import MemberAddBtn from './member-add-btn';
import RemoveStaffBtn from './remove-staff-btn';

const size = 'middle';

function MembersTable(): JSX.Element {
    const loading = useSelector((state: any) => state.staff.loading);
    const staffs = useSelector((state: any) => state.staff.staffs);

    const dispatch = useDispatch();

    const dataSource = staffs
        .filter((staff: IStaff) => staff.role !== 0)
        .map((staff: IStaff) => ({
            ...staff,
            key: staff._id,
        }));

    const reloadStaff = () => {
        dispatch(loadStaffs());
    };

    const columns: any = [
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },

        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },

        {
            title: 'Vị trí',
            dataIndex: '',
            render: (staff: IStaff) => {
                return <ChangeRole staff={staff} />;
            },
            key: 'role',
        },

        {
            title: '',
            align: 'right',
            dataIndex: '',

            render: (staff: IStaff) => {
                return (
                    <>
                        <RemoveStaffBtn staff={staff} />
                        <EditMemberForm staff={staff} />
                    </>
                );
            },
            key: 'remove',
        },
    ];

    return (
        <>
            <div className='header-page'>
                <Row gutter={15}>
                    <Col>
                        <MemberAddBtn size={size} />
                    </Col>

                    <Col>
                        <Button icon={<ReloadOutlined />} onClick={reloadStaff} loading={loading}>
                            Cập nhật danh sách
                        </Button>
                    </Col>
                </Row>
            </div>
            <Table columns={columns} dataSource={dataSource} loading={loading} />
        </>
    );
}

export default MembersTable;
