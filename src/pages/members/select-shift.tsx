import React from 'react';
import { Select } from 'antd';

import { Shift, Member } from './types';

interface IProps {
    member: Member;
}

function SelectShift({ member }: IProps): JSX.Element {
    const { shifts } = member;
    return (
        <Select mode='multiple' style={{ width: '100%' }} onChange={() => {}}>
            {shifts.map((shift: Shift) => (
                <Select.Option key={shift.id} value={shift.id}>
                    {shift.name}
                </Select.Option>
            ))}
        </Select>
    );
}

export default SelectShift;
