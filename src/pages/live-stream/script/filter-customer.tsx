import { DeleteOutlined } from '@ant-design/icons';
import { Button, Col, Input, Popover, Row, Select, Space } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { DownIcon } from '../../../assets/icon';

import { DataFilterItem } from './livestream-customer';

interface IFilterItem {
    value: string;
    title: string;
    filters: any[];
    value_filter?: any;
}

interface FilterRowProps {
    filter: IFilterItem;
    updateFilter: (filter: any, item: any) => void;
    removeFilter: (value: any) => void;
}

const FilterRow: FC<FilterRowProps> = ({ filter, updateFilter, removeFilter }) => {
    return (
        <Row gutter={15} key={filter.value}>
            <Col style={{ flex: 1 }}>
                <Row gutter={15}>
                    <Col>
                        <Input value={filter.title} disabled />
                    </Col>
                    <Col style={{ flex: 1 }}>
                        <Row justify='space-between' gutter={15}>
                            {filter.filters.map((item: any) => (
                                <Col key={item.title}>
                                    <Button
                                        block
                                        type={
                                            filter.value_filter &&
                                            filter.value_filter.title === item.title
                                                ? 'primary'
                                                : 'default'
                                        }
                                        onClick={() => updateFilter(filter, item)}
                                    >
                                        {item.title}
                                    </Button>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </Col>

            <Col>
                <Button
                    icon={<DeleteOutlined />}
                    onClick={() => removeFilter(filter.value)}
                ></Button>
            </Col>
        </Row>
    );
};

interface Props {
    handleFilter: (filters: any) => void;
    filters: any[];
    tabName: string;
    dataDefaultFilter: DataFilterItem[];
}

const FilterCustomer: FC<Props> = (props) => {
    const [visible, setVisible] = useState(false);
    const [filters, setFilters] = useState<IFilterItem[]>([]);

    const [dataFilters, setDataFilters] = useState<DataFilterItem[]>(props.dataDefaultFilter);

    const onSelectFilter = (value: any) => {
        const filter = dataFilters.find((item) => item.value === value);

        if (filter) {
            setFilters([...filters, filter]);

            const newDataFilters = dataFilters.map((item) => {
                if (item.value === value) return { ...item, hide: true };
                return item;
            });
            setDataFilters(newDataFilters);
        }
    };

    const updateFilter = (filter: any, item: any) => {
        const newFilter = filters.map((f: any) => {
            if (f.value === filter.value) return { ...f, value_filter: item };
            return f;
        });
        setFilters(newFilter);
    };

    const removeFilter = (value: any) => {
        const newFilters = filters.filter((item: IFilterItem) => item.value !== value);

        setFilters(newFilters);

        const newDataFilters = dataFilters.map((item) => {
            if (item.value !== value) return { ...item, hide: false };
            return item;
        });
        setDataFilters(newDataFilters);
    };

    const toggle = () => setVisible(!visible);

    const onFilter = () => {
        const filterHasValue = filters.filter((item: any) => item.value_filter);
        props.handleFilter(filterHasValue);
        toggle();
    };

    const dataFiltersShow = dataFilters.filter((item: DataFilterItem) => !item.hide);

    useEffect(() => {
        setFilters(props.filters);
        const values: string[] = props.filters.map((item: any) => item.value);

        const newDataFilters = props.dataDefaultFilter.map((item) => {
            if (values.includes(item.value)) return { ...item, hide: true };
            return item;
        });

        setDataFilters(newDataFilters);
    }, [props.filters]);

    const overlayContent = (
        <div>
            <Space style={{ width: '100%' }} size={15} direction='vertical'>
                <span>Hiển thị kịch bản theo: </span>

                {filters.length > 0 && (
                    <Space style={{ width: '100%' }} size={15} direction='vertical'>
                        {filters.map((filter) => {
                            return (
                                <div key={filter.value}>
                                    <FilterRow
                                        filter={filter}
                                        updateFilter={updateFilter}
                                        removeFilter={removeFilter}
                                    />
                                </div>
                            );
                        })}
                    </Space>
                )}

                {dataFiltersShow.length > 0 && (
                    <Select value={'default'} onChange={onSelectFilter}>
                        <Select.Option value='default'>Chọn điều kiện lọc</Select.Option>
                        {dataFiltersShow.map((filter: any) => (
                            <Select.Option value={filter.value} key={filter.value}>
                                {filter.title}
                            </Select.Option>
                        ))}
                    </Select>
                )}

                <Button type='primary' onClick={onFilter}>
                    Lọc
                </Button>
            </Space>
        </div>
    );

    return (
        <Popover
            content={overlayContent}
            placement='bottomLeft'
            trigger='click'
            visible={visible}
            onVisibleChange={toggle}
        >
            <Button block>
                Lọc khách hàng <DownIcon />
            </Button>
        </Popover>
    );
};

export default FilterCustomer;
