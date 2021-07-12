import React from 'react';
import { Select } from 'antd';
import { dataStatusScript } from '../../../data';
import { DownIcon } from '../../../../../../assets/icon';

interface Props {
    onChange?: Function;
    value: any;
}

const RightSideStatus = (props: Props) => {
    const onSelectActiveStatusChange = (select_value: number) => {
        props.onChange && props.onChange(select_value);
    };

    return (
        <div className='right-side-action-active'>
            <Select
                suffixIcon={<DownIcon />}
                value={props.value}
                onChange={onSelectActiveStatusChange}
                style={{ width: '100%' }}
                placeholder='Chọn trạng thái sử dụng'
            >
                {Object.values(dataStatusScript).map((useStatus: any) => (
                    <Select.Option value={useStatus.id} key={useStatus.id}>
                        {useStatus.title}
                    </Select.Option>
                ))}
            </Select>
        </div>
    );
};

export default RightSideStatus;
