import React, { FC } from 'react';
import { Select } from 'antd';

const SelectPage: FC = (): JSX.Element => {
    return (
        <Select defaultValue='tien' style={{ width: '100%' }}>
            <Select.Option value='tien'>Giá</Select.Option>
            <Select.Option value='so_luong'>Số lượng</Select.Option>
        </Select>
    );
};

export default SelectPage;
