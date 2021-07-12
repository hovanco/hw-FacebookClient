import React, { FC } from 'react';
import { Select } from 'antd';

interface Props {
    selectDateType: (type: string) => void;
    type: string;
}

const SelectDateType: FC<Props> = ({ selectDateType, type }): JSX.Element => {
    return (
        <Select
            style={{ width: '100%' }}
            placeholder=''
            onChange={selectDateType}
            defaultValue={type}
        >
            <Select.Option value='day'>Ngày </Select.Option>
            <Select.Option value='week'>Tuần </Select.Option>
            <Select.Option value='month'>Tháng </Select.Option>
            <Select.Option value='custom'>Tùy chọn ngày </Select.Option>
        </Select>
    );
};

export default SelectDateType;
