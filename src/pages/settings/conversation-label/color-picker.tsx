import React, { FC, useState } from 'react';
import { ChromePicker } from 'react-color';
import { Popover, Input } from 'antd';

interface Props {
    color?: string;
    pickColor: any;
    label: string;
    style?: any;
}

const ColorPicker: FC<Props> = ({ color, pickColor, label, style }) => {
    const [visible, setVisible] = useState(false);
    const [color_state, setColorState] = useState(color);

    const handleVisibleChange = () => setVisible(!visible);

    const selectColor = (color_pick: any, event: any) => {
        setColorState(color_pick.hex);
        pickColor(color_pick.hex);
        // setVisible(false);
    };

    return (
        <>
            <Popover
                content={
                    <ChromePicker onChangeComplete={selectColor} color={color_state || 'yellow'} />
                }
                trigger='click'
                visible={visible}
                onVisibleChange={handleVisibleChange}
            >
                <div className='color-picker-trigger' style={style}>
                    <Input placeholder={label} value={color_state} />
                    <div
                        className='color-picker-trigger__color-value'
                        style={{ background: color_state }}
                    ></div>
                </div>
            </Popover>
        </>
    );
};

export default ColorPicker;
