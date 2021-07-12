import React, { FC } from 'react';
import { Select } from 'antd';

const SelectMember: FC = (): JSX.Element => {
    return <Select style={{ width: '100%' }} placeholder='Chọn nhân viên'></Select>;
};

export default SelectMember;
