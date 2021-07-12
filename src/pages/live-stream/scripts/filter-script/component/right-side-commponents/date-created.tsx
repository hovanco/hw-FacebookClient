import React, { memo, useState, useEffect } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

interface Props {
    onChange?: Function;
    value: any;
}

const { RangePicker } = DatePicker;

const RightSideDateCreated = (props: Props) => {
    const onChange = async (values: any) => {
        const dates = values
            ? [moment(values[0]).startOf('day').valueOf(), moment(values[1]).endOf('day').valueOf()]
            : [undefined, undefined];

        props.onChange && props.onChange(dates);
    };

    return (
        <RangePicker
            onChange={onChange}
            value={props.value ? [moment(props.value[0]), moment(props.value[1])] : undefined}
        />
    );
};

export default RightSideDateCreated;
