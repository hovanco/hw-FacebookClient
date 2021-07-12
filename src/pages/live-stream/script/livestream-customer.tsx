import { Button, Card, Col, Input, Pagination, Row, Tabs, Tag } from 'antd';
import { TablePaginationConfig } from 'antd/lib/table';
import { debounce } from 'lodash';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import livestreamApi from '../../../api/livestream-api';
import { CloseIcon, SearchIcon } from '../../../assets/icon';
import { ConversationType } from '../../../collections/facebook-conversation';
import { ILivestreamScript } from '../../../collections/livestream-script';
import { TagFilter } from '../../../components';
import FilterCustomer from './filter-customer';
import LivestreamCustomerTable from './livestream-customer-table';

export interface DataFilterItem {
    value: string;
    title: string;
    hide?: boolean;
    filters: any[];
}

export const default_data_filters: DataFilterItem[] = [
    {
        value: 'phoneNo',
        title: 'Số điện thoại',
        filters: [
            {
                title: 'Có số điện thoại',
                isHasPhoneNo: true,
            },
            {
                title: 'Không có số điện thoại',
                isHasPhoneNo: false,
            },
        ],
    },
];

interface TabKeywordProps {
    keyword: string;
    handleSelectKeyWord: (id: number, keyword: any) => void;
    isActive: boolean;
    id: number;
}

const TagKeyword: FC<TabKeywordProps> = ({ keyword, handleSelectKeyWord, isActive, id }) => {
    const color = isActive ? 'blue' : 'default';

    const onClick = () => {
        handleSelectKeyWord(id, keyword);
    };

    return (
        <div className='keyword'>
            <Tag style={{ cursor: 'pointer' }} color={color} onClick={onClick}>
                {keyword}
            </Tag>
        </div>
    );
};

interface Props {
    script: ILivestreamScript;
}

const { TabPane } = Tabs;
const LIMIT = 15;

const LivestreamCustomer: FC<Props> = ({ script }) => {
    const store = useSelector((state: any) => state.store.store);
    const [filters, setFilters] = useState<any[]>([]);

    const [tab, setTab] = useState<string>('all');
    const [loading, setLoading] = useState(true);
    const [customers, setCustomer] = useState<any[]>([]);
    const [total, setTotal] = useState<number>(1);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(LIMIT);
    const [text, setText] = useState<string | undefined>();
    const [isHasOrder, setIsHasOrder] = useState<string | undefined>(undefined);
    const [isHasPhoneNo, setIsHasPhoneNo] = useState<string | undefined>(undefined);
    const [idKeywordActive, setIdKeywordActive] = useState<number>();
    const [textSearch, setTextSearch] = useState<any>();

    const handleSearch = (searchText: string) => {
        const textString = searchText.length > 0 ? searchText : undefined;
        setText(textString);
    };

    const handleSearchTimeOut = (searchText: string) => {
        setIdKeywordActive(-1);
        setTextSearch(searchText);
        debouncedSearch(searchText);
    };
    const debouncedSearch = useCallback(debounce(handleSearch, 300), []);

    const handleSelectKeyWord = (id: number, text: string) => {
        if (id === idKeywordActive) {
            setIdKeywordActive(-1);
            handleSearch('');
            setTextSearch('');
        } else {
            setIdKeywordActive(id);
            handleSearch(text);
            setTextSearch(text);
        }
    };

    const changeTab = (key: string) => {
        if (key === 'noOrder') {
            setIsHasOrder('false');
        } else if (key === 'hasOrder') {
            setIsHasOrder('true');
        } else {
            setIsHasOrder('undefined');
        }

        setTab(key);
    };

    const onChangeTable = (pagination: TablePaginationConfig) => {
        setPage(Number(pagination.current));
        setPageSize(Number(pagination.pageSize));
    };

    const handleFilter = (newFilters: any[]) => {
        if (['noOrder', 'hasOrder'].includes(tab)) {
            setFilters([...filters, ...newFilters]);
        } else {
            setFilters(newFilters);
        }
    };

    const removeFilter = (filter: any) => {
        const newFilters = filters.filter((item: any) => item.value !== filter.value);

        setFilters(newFilters);
    };

    const loadCustomers = useCallback(async () => {
        setLoading(true);

        const isHasOrderValue =
            !isHasOrder || isHasOrder === 'undefined' ? undefined : JSON.parse(isHasOrder);
        const isHasPhoneNoValue =
            !isHasPhoneNo || isHasPhoneNo === 'undefined' ? undefined : JSON.parse(isHasPhoneNo);

        const response = await livestreamApi.getCustomerInLivestream({
            storeId: store._id,
            scriptId: script._id,
            fbPageId: script.fbPageId,
            page,
            limit: pageSize,
            isHasOrder: isHasOrderValue,
            isHasPhoneNo: isHasPhoneNoValue,
            search: text,
        });

        setCustomer(response.customerOrders);
        setTotal(response.total);
        setLoading(false);
    }, [isHasOrder, isHasPhoneNo, store._id, script._id, script.fbPageId, page, pageSize, text]);

    const reloadCustomer = () => {
        loadCustomers();
    };

    const changePagination = (page: number, pageSize: number | undefined) => {
        setPage(page);
        setPageSize(pageSize || 1);
    };

    useEffect(() => {
        const newFilterValue: any[] = filters.map((item: any) => item.value_filter);
        if (newFilterValue.length > 0) {
            newFilterValue.forEach((item) => {
                setIsHasPhoneNo(`${item['isHasPhoneNo']}`);
                setIsHasOrder(`${item['isHasOrder']}`);
            });
        } else {
            setIsHasPhoneNo('undefined');
            setIsHasOrder('undefined');
        }
    }, [filters]);

    useEffect(() => {
        loadCustomers();
    }, [page, pageSize, isHasOrder, isHasPhoneNo, text]);

    const filterDataFilterDefault = ['noOrder', 'hasOrder'].includes(tab)
        ? default_data_filters.filter((item: any) => item.value !== 'order')
        : default_data_filters;

    const filterValuetFilters = ['noOrder', 'hasOrder'].includes(tab)
        ? filters.filter((item: any) => item.value !== 'order')
        : filters;

    const renderKeywords = script.keywords.map((item: any, index: number) => {
        return (
            <TagKeyword
                keyword={item.keyword}
                key={item.keyword + index}
                id={index}
                handleSelectKeyWord={handleSelectKeyWord}
                isActive={index === idKeywordActive}
            />
        );
    });

    return (
        <div style={{ marginBottom: 20 }} className='script-report-cutomer'>
            <Card bodyStyle={{ padding: 0 }} style={{ borderColor: '#cfd2d4', overflow: 'hidden' }}>
                <Tabs
                    activeKey={tab}
                    onChange={changeTab}
                    tabBarStyle={{ padding: '0 20px' }}
                    tabBarExtraContent={
                        <a
                            href={`/customer/conversation?pageId=${script.fbPageId}&postId=${script.fbPageId}_${script.videoId}&type=${ConversationType.Comment}`}
                            target='_blank'
                        >
                            <Button type='primary'>Xem tất cả bình luận trong hội thoại</Button>
                        </a>
                    }
                >
                    <TabPane tab='Tất cả bình luận' key='all'></TabPane>
                    <TabPane tab='Chưa được tạo đơn' key='noOrder'></TabPane>
                    <TabPane tab='Đã được tạo đơn' key='hasOrder'></TabPane>
                </Tabs>
                <div>
                    <div style={{ padding: '20px' }}>
                        <Row gutter={15}>
                            <Col span={4}>
                                <FilterCustomer
                                    handleFilter={handleFilter}
                                    filters={filterValuetFilters}
                                    dataDefaultFilter={filterDataFilterDefault}
                                    tabName={tab}
                                />
                            </Col>

                            <Col span={12}>
                                <Input
                                    onChange={(e: any) => handleSearchTimeOut(e.target.value)}
                                    prefix={<SearchIcon />}
                                    value={textSearch}
                                    allowClear
                                    placeholder='Nhập từ khóa tìm kiếm'
                                />
                            </Col>
                            <Col span={24}>
                                <div className='keywords'>{renderKeywords}</div>
                            </Col>
                        </Row>

                        {filters.length > 0 && (
                            <div style={{ marginTop: 10 }}>
                                {filters.map((filter: any) => {
                                    const closable =
                                        ['noOrder', 'hasOrder'].includes(tab) &&
                                        filter.value === 'order';
                                    return (
                                        <TagFilter
                                            closable={!closable}
                                            closeIcon={<CloseIcon />}
                                            key={filter.value}
                                            onClose={() => removeFilter(filter)}
                                        >
                                            {filter.title}: {filter.value_filter.title}
                                        </TagFilter>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <LivestreamCustomerTable
                        script={script}
                        customers={customers}
                        loading={loading}
                        total={total}
                        page={page}
                        pageSize={pageSize}
                        onChangeTable={onChangeTable}
                        reloadCustomer={reloadCustomer}
                    />
                </div>
            </Card>
            <Row justify='end'>
                <Col>
                    <Pagination
                        total={total}
                        showSizeChanger
                        pageSize={pageSize}
                        onChange={changePagination}
                        style={{ marginTop: 20 }}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default LivestreamCustomer;
