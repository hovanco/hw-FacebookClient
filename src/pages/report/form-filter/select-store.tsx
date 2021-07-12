import React, { FC } from 'react';
import { Select } from 'antd';

const SelectStore: FC = (): JSX.Element => {
    return <Select style={{ width: '100%' }} placeholder='Chọn kho hàng'></Select>;
};

export default SelectStore;
