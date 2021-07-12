import { DatePicker } from 'antd';
import moment from 'moment';
import React from 'react';
import { useDispatch } from 'react-redux';
import { changeDate, loadLivestreams } from '../../../reducers/livestreamState/livestreamAction';

interface Props {}

const { RangePicker } = DatePicker;

const SelectDate = (props: Props) => {
    const dispatch = useDispatch();
    const onChange = async (values: any) => {
        const dates = values
            ? values.map((date: any) => moment(date).valueOf())
            : [undefined, undefined];

        await dispatch(changeDate(dates));
        dispatch(loadLivestreams());
    };

    return <RangePicker onChange={onChange} />;
};

export default SelectDate;
