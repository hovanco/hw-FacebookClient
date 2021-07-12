import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { BaseLayout } from '../../layout';
import { loadStaffs } from '../../reducers/staffState/staffAction';
import { useNotification } from '../customer/notfication-context';
import MembersTable from './members-table';
import HeaderRight from '../../components/header-customer/header-right';
import './style.less';

const text = 'Nhân viên';

function Members(): JSX.Element {
    const { title } = useNotification();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadStaffs());
    }, []);

    const title_page = `${title} ${text}`;

    return (
        <BaseLayout title={title_page}>
            <div className='main member-wrap'>
                <HeaderRight title={text} />
                <div className='content-page content'>
                    <MembersTable />
                </div>
            </div>
        </BaseLayout>
    );
}

export default Members;
