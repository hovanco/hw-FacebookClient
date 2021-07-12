import React, { FC } from 'react';
import moment from 'moment';
import { DatePicker } from 'antd';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

interface SelectDateProps {
    date: any;
    selectDate: (date: any) => void;
    type: string;
    allowClear?: boolean;
}

const SelectDate: FC<SelectDateProps> = ({ date, selectDate, type, allowClear = false }) => {
    if (type === 'day')
        return (
            <DatePicker
                onChange={selectDate}
                defaultValue={moment(date)}
                format='DD/MM/YYYY'
                allowClear={allowClear}
                style={{ width: '100%' }}
            />
        );
    if (type === 'week')
        return (
            <WeekPicker
                format='WW/YYYY'
                onChange={selectDate}
                style={{ width: '100%' }}
                allowClear={allowClear}
                defaultValue={moment(date)}
            />
        );
    if (type === 'custom')
        return (
            <RangePicker
                onChange={selectDate}
                style={{ width: '100%' }}
                format='DD/MM/YYYY'
                allowClear={allowClear}
                defaultValue={[moment(date), moment(date)]}
            />
        );
    return (
        <MonthPicker
            onChange={selectDate}
            format='MM/YYYY'
            style={{ width: '100%' }}
            allowClear={allowClear}
            defaultValue={moment(date)}
        />
    );
};

export default SelectDate;
