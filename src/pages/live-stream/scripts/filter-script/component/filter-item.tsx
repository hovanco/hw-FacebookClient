import React, { memo } from 'react';
import { Select } from 'antd';
import { FilterOptions, FilterData } from '../interface';
import RightSideStatus from './right-side-commponents/status';
import RightSideActive from './right-side-commponents/active';
import RightSideDateCreated from './right-side-commponents/date-created';
import { DownIcon, TrashIcon } from '../../../../../assets/icon';

interface Props {
    data: FilterData;
    options: Array<FilterOptions>;
    onFilterKeyChange?: Function;
    onRemoveFilterItem?: Function;
    onFilterValueChange?: Function;
}

const FilterItem = (props: Props) => {
    const onSelectLeftSideChange = (ls_value: string) => {
        props.onFilterKeyChange && props.onFilterKeyChange(ls_value);
    };

    const onRightSideChange = async (rs_value: any) => {
        props.onFilterValueChange && props.onFilterValueChange(props.data.key, rs_value);
    };

    const onClearItem = () => {
        props.onRemoveFilterItem && props.onRemoveFilterItem(props.data.key);
    };

    const renderRightSide = () => {
        if (props.data.key === 'status')
            return <RightSideStatus onChange={onRightSideChange} value={props.data.value} />;

        if (props.data.key === 'active')
            return <RightSideActive onChange={onRightSideChange} value={props.data.value} />;

        if (props.data.key === 'date_created')
            return <RightSideDateCreated onChange={onRightSideChange} value={props.data.value} />;

        return <></>;
    };

    return (
        <div className='advance-script-filter-item'>
            <div className='left-side'>
                <Select
                    suffixIcon={<DownIcon />}
                    value={props.data.key}
                    style={{ width: 170 }}
                    onChange={onSelectLeftSideChange}
                >
                    {props.options
                        .filter((i) => {
                            if (props.data.key !== 'default') return i.value !== 'default';

                            return i.used !== true;
                        })
                        .map((option) => {
                            return (
                                <Select.Option value={option.value} key={option.value}>
                                    {option.label}
                                </Select.Option>
                            );
                        })}
                </Select>
            </div>
            <div className='right-side'>{renderRightSide()}</div>
            {props.data.key !== 'default' && (
                <div className='clear-filter-item'>
                    <TrashIcon onClick={onClearItem} />
                </div>
            )}
        </div>
    );
};

export default memo(FilterItem);
