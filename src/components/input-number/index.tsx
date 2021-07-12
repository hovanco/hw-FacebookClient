import React, { FC, memo } from 'react';
import { InputNumber as Input } from 'antd';
import { InputNumberProps } from 'antd/lib/input-number';

interface Props extends InputNumberProps {
    onChange: (value: any) => void;
}

const InputNumber: FC<Props> = ({ onChange, ...props }) => {
    const handleChangeNumber = (value: any) => {
        if (typeof value === 'number') {
            onChange(value);
        }
    };
    return <Input onChange={handleChangeNumber} {...props} />;
};

export default memo(InputNumber);
