import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useMemo, memo } from 'react';
import { Popover, Button } from 'antd';
import FilterItem from './component/filter-item';
import { FilterOptions, FilterData } from './interface';
import { isEqual } from 'lodash';
import {
    changeFilter,
    loadLivestreams,
} from '../../../../reducers/livestreamState/livestreamAction';
import { DownIcon } from '../../../../assets/icon';

import './index.less';

interface Props {}

const defaultFilterOptions: Array<FilterOptions> = [
    { label: 'Chọn điều kiện lọc', value: 'default', used: false },
    { label: 'Trạng thái kịch bản', value: 'active', used: false },
    { label: 'Trạng thái sử dụng', value: 'status', used: false },
    { label: 'Ngày tạo', value: 'date_created', used: false },
];

const FilterScript = (props: Props) => {
    const dispatch = useDispatch();
    const startTime: number | undefined = useSelector((state: any) => state.livestream.startTime);
    const endTime: number | undefined = useSelector((state: any) => state.livestream.endTime);
    const status: number | undefined = useSelector((state: any) => state.livestream.status);
    const active: number | undefined = useSelector((state: any) => state.livestream.active);
    const [filterOptions, setFilterOptions] = useState<Array<FilterOptions>>(defaultFilterOptions);
    const [filterData, setFilterData] = useState<Array<FilterData>>([]);
    const [popoverVisible, setPopoverVisible] = useState<boolean>(false);

    useEffect(() => {
        let newFilterOptions: Array<FilterOptions> = defaultFilterOptions;
        let newFilterData: Array<FilterData> = [];

        if (active !== undefined) {
            newFilterData.push({ key: 'active', value: active });
            newFilterOptions = newFilterOptions.map((i: FilterOptions) => {
                return i.value === 'active' ? { ...i, used: true } : i;
            });
        }

        if (status !== undefined) {
            newFilterData.push({ key: 'status', value: status });
            newFilterOptions = newFilterOptions.map((i: FilterOptions) => {
                return i.value === 'status' ? { ...i, used: true } : i;
            });
        }

        if (startTime !== undefined || endTime !== undefined) {
            newFilterData.push({ key: 'date_created', value: [startTime, endTime] });
            newFilterOptions = newFilterOptions.map((i: FilterOptions) => {
                return i.value === 'date_created' ? { ...i, used: true } : i;
            });
        }

        if (!isEqual(newFilterOptions, filterOptions)) setFilterOptions(newFilterOptions);
        if (newFilterData.length < 3)
            newFilterData = [...newFilterData, { key: 'default', value: undefined }];
        if (!isEqual(newFilterData, filterData)) setFilterData(newFilterData);
    }, [status, active, startTime, endTime, popoverVisible]);

    const onFilterKeyChange = (prevKey: string, nextKey: string) => {
        let newFilterOptions: Array<FilterOptions> = filterOptions;
        let newFilterData: Array<FilterData> = filterData;

        newFilterOptions = newFilterOptions.map((i) => {
            if (i.value === prevKey) return { ...i, used: false };
            if (i.value === nextKey) return { ...i, used: true };

            return i;
        });

        newFilterData = newFilterData.map((i) => {
            if (i.key === prevKey) return { key: nextKey, value: undefined };

            return i;
        });

        if (!isEqual(newFilterOptions, filterOptions)) setFilterOptions(newFilterOptions);
        if (prevKey === defaultFilterOptions[0].value && newFilterData.length < 3)
            newFilterData = [...newFilterData, { key: 'default', value: undefined }];
        if (!isEqual(newFilterData, filterData)) setFilterData(newFilterData);
    };

    const onFilterValueChange = (key: string, nextValue: any) => {
        let newFilterData: Array<FilterData> = filterData;

        newFilterData = newFilterData.map((i) => {
            if (i.key === key) return { ...i, value: nextValue };

            return i;
        });

        if (!isEqual(newFilterData, filterData)) setFilterData(newFilterData);
    };

    const onRemoveFilterItem = (removedKey: string) => {
        let newFilterData: Array<FilterData> = filterData;

        newFilterData = newFilterData.filter((i) => i.key !== removedKey);

        if (
            newFilterData.length < 3 &&
            newFilterData.filter((i) => i.key === 'default').length === 0
        )
            newFilterData = [...newFilterData, { key: 'default', value: undefined }];
        if (!isEqual(newFilterData, filterData)) setFilterData(newFilterData);
    };

    const onSubmitFilter = async () => {
        setPopoverVisible(false);

        let submitFilterData: any = {
            status: undefined,
            startTime: undefined,
            endTime: undefined,
            active: undefined,
        };

        filterData
            .filter((i) => i.key !== defaultFilterOptions[0].value)
            .forEach((filterItemData) => {
                if (filterItemData.key == 'date_created') {
                    submitFilterData['startTime'] = filterItemData.value
                        ? filterItemData.value[0]
                        : undefined;
                    submitFilterData['endTime'] = filterItemData.value
                        ? filterItemData.value[1]
                        : undefined;
                } else submitFilterData[filterItemData.key] = filterItemData.value;
            });

        await dispatch(changeFilter(submitFilterData));
        dispatch(loadLivestreams());
    };

    const overlayContent = useMemo(
        () => (
            <div>
                <span className='advance-script-filter-lead-text'>Hiển thị kịch bản theo: </span>
                <div className='advance-script-filter-items'>
                    {filterData.map((filterItemData: FilterData, filterItemIndex: number) => (
                        <FilterItem
                            data={filterItemData}
                            key={`filter-item-${filterItemIndex}`}
                            options={filterOptions}
                            onFilterKeyChange={(nextKey: string) =>
                                onFilterKeyChange(filterItemData.key, nextKey)
                            }
                            onFilterValueChange={onFilterValueChange}
                            onRemoveFilterItem={onRemoveFilterItem}
                        />
                    ))}
                </div>
                <div className='advance-script-filter-btn'>
                    <Button type='primary' onClick={onSubmitFilter}>
                        Lọc
                    </Button>
                </div>
            </div>
        ),
        [filterOptions, filterData]
    );

    return (
        <div className='advance-script-filter'>
            <Popover
                content={overlayContent}
                trigger='click'
                placement='bottom'
                visible={popoverVisible}
                onVisibleChange={setPopoverVisible}
            >
                <Button className='btn-trigger-popover'>
                    Lọc kịch bản <DownIcon />
                </Button>
            </Popover>
        </div>
    );
};

export default memo(FilterScript);
