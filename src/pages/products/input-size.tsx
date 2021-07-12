import React from 'react';
import { InputNumber } from 'antd';

interface Props {
    size?: number;
    changeSize: (value: any) => void;
}

const errorStyle = {
    borderColor: 'red',
};

const InputSize = (props: Props) => {
    const style = props.size === 0 ? { ...errorStyle } : {};
    return <InputNumber value={props.size} onChange={props.changeSize} style={style} />;
};

export default InputSize;
