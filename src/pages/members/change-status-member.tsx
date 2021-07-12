import React from 'react';
import { Switch } from 'antd';

import { Member } from './types';

interface IProps {
    member: Member;
    members: Member[];
}

function ChangeStatusMember({ member, members }: IProps): JSX.Element {
    const { status } = member;
    const checked = !!(typeof status === 'undefined' || status);

    const changeStatus = () => {};

    return <Switch checked={checked} onChange={changeStatus} />;
}

export default React.memo(ChangeStatusMember);
