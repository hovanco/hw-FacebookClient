import { FileAddOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Checkbox, Col, Row, Space, Table, Tooltip } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import { isUndefined } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { DownIcon } from '../../../assets/icon';
import { TextEllipsis } from '../../../components';
import { changeFilter, loadLivestreams } from '../../../reducers/livestreamState/livestreamAction';
import Post from './post';
import ScriptCopy from './script-copy';
import ScriptTableAction from './script-table-action';
import './script-table.less';
import SwitchActiveScript from './switch-active-script';

const renderCountNumber = (value?: number) => (isUndefined(value) ? '---' : value);

const getTitle = (status: number): { label: string; title: string; color: string } => {
    switch (status) {
        case 0:
            return {
                color: '#0872d7',
                label: 'Chưa sử dụng',
                title: 'Kịch bản chưa được áp dụng cho bài livestream.',
            };
        case 1:
            return {
                color: '#307dd2',
                label: 'Đang sử dụng',
                title: 'Kịch bản đang được áp dụng cho bài livestream.',
            };
        case 2:
            return {
                color: '#23ad44',
                label: 'Đang tạo đơn hàng',
                title: 'Đang tạo đơn hàng',
            };

        case 3:
            return {
                color: '#23b7e5',
                label: 'Đang chờ xử lý',
                title: 'Đang chờ xử lý',
            };
        default:
            return {
                color: '#f05050',
                label: 'Đã sử dụng',
                title: 'Kịch bản đã sử dụng',
            };
    }
};

const columns: ColumnsType<any> = [
    {
        title: 'Tên kịch bản',
        dataIndex: '',
        key: 'name',
        width: 250,
        sorter: true,

        render: (script: any) => {
            return (
                <Link
                    to={`script/${script.fbPageId}/${script._id}`}
                    className='insa-align-center script-link'
                >
                    <TextEllipsis width={250}>
                        <Tooltip title={script.name}>{script.name}</Tooltip>
                    </TextEllipsis>
                </Link>
            );
        },
    },

    {
        title: 'Bài viết',
        dataIndex: '',
        key: 'text',

        width: 210,
        render: (script: any) => {
            return <Post script={script} />;
        },
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        render: (status: number) => {
            const { label, color, title } = getTitle(status);
            return (
                <Space>
                    <span style={{ color }}>{label}</span>
                    <Tooltip title={title} placement='top'>
                        <QuestionCircleOutlined />
                    </Tooltip>
                </Space>
            );
        },
    },
    {
        title: 'Khách hàng',
        dataIndex: 'customerCount',
        key: 'customerCount',
        align: 'center',
        render: (customerCount) => renderCountNumber(customerCount),
    },
    {
        title: 'Bình luận',
        dataIndex: 'commentCount',
        key: 'commentCount',
        align: 'center',
        render: (commentCount) => renderCountNumber(commentCount),
    },
    {
        title: 'Đơn hàng',
        dataIndex: 'orderCount',
        key: 'orderCount',
        align: 'center',
        render: (orderCount) => renderCountNumber(orderCount),
    },
    {
        title: 'Thao tác',
        dataIndex: '',
        key: 'actions',
        align: 'center',
        width: 90,
        render: (script) => {
            const title = script.active ? 'Ngưng kích hoạt' : 'Kích hoạt';

            return (
                <Row gutter={5} justify='space-around' align='middle'>
                    <Col>
                        <Tooltip title={title}>
                            <SwitchActiveScript script={script} />
                        </Tooltip>
                    </Col>
                    <Col>
                        <Tooltip title='Sao chép kịch bản' placement='top'>
                            <span>
                                <ScriptCopy script={script}>
                                    <FileAddOutlined style={{ fontSize: 20, color: '#9f9f9f' }} />
                                </ScriptCopy>
                            </span>
                        </Tooltip>
                    </Col>
                </Row>
            );
        },
    },
    {
        title: 'Ngày tạo',
        dataIndex: 'createdAt',
        align: 'center',
        width: 100,
        sorter: true,
        defaultSortOrder: 'descend',
        key: 'createdAt',
        render: (createdAt) => moment(createdAt).format('DD/MM/YYYY HH:mm'),
    },
];

interface Props {}

const ScriptTable = (props: Props) => {
    const dispatch = useDispatch();
    const scripts = useSelector((state: any) => state.livestream.scripts);
    const loading = useSelector((state: any) => state.livestream.loading);
    const total = useSelector((state: any) => state.livestream.total);
    const limit = useSelector((state: any) => state.livestream.limit);
    const page = useSelector((state: any) => state.livestream.page);
    const fbPageId = useSelector((state: any) => state.livestream.fbPageId);

    const [scripts_select, setScriptsSelect] = useState([]);
    const [rowSelection, setRowSelection] = useState<any>({
        onChange: (selectedRowKeys: any, selectedRows: any) => {
            setScriptsSelect(selectedRows);
        },
        columnTitle: undefined,
    });

    useEffect(() => {
        const antTableHeadEle: HTMLTableHeaderCellElement | null = document?.querySelector(
            '.livestream-list-section .ant-table-thead'
        );
        var scriptActionsWidth: number = antTableHeadEle ? antTableHeadEle.clientWidth : 0;

        setRowSelection({
            ...rowSelection,
            selectedRowKeys: scripts_select.map((i: any) => i?._id),
            columnTitle:
                scripts_select.length > 0 ? (
                    <div className='script-actions' style={{ width: scriptActionsWidth }}>
                        <div className='checkbox-section'>
                            <Checkbox
                                indeterminate={
                                    scripts_select.length === scripts.length ? false : true
                                }
                                onChange={
                                    scripts_select.length === scripts.length
                                        ? resetScriptSelect
                                        : selectedAllRow
                                }
                                checked={!!scripts_select.length}
                            >
                                <span className='checkbox-next-text'>
                                    Đã chọn ({scripts_select.length} kịch bản)
                                </span>
                            </Checkbox>
                        </div>
                        <div className='script-dropdown-action'>
                            <ScriptTableAction
                                scripts={scripts_select}
                                resetScriptSelect={resetScriptSelect}
                            />
                        </div>
                    </div>
                ) : (
                    <div className='script-actions not-select' style={{ width: 63 }}>
                        <div className='checkbox-section'>
                            <Checkbox
                                onChange={
                                    scripts_select.length === scripts.length
                                        ? resetScriptSelect
                                        : selectedAllRow
                                }
                                checked={!!scripts_select.length}
                            />

                            <DownIcon className='down-icon-suffix' />
                        </div>
                    </div>
                ),
        });

        // eslint-disable-next-line
    }, [scripts_select, scripts]);

    useEffect(() => {
        resetScriptSelect();
    }, [fbPageId]);

    const onChange = async (pagination: TablePaginationConfig, filters: any, sorter: any) => {
        const sort = sorter.columnKey;
        const direction =
            sorter.order === 'descend' ? 'desc' : sorter.order === 'ascend' ? 'asc' : undefined;

        await dispatch(
            changeFilter({
                sort,
                direction,
                page,
                limit,
            })
        );
        await dispatch(loadLivestreams());
    };

    const resetScriptSelect = () => {
        setScriptsSelect([]);
    };
    const selectedAllRow = () => {
        setScriptsSelect(scripts);
    };

    const renderFooter = (currentPageData: any) => {
        return (
            <div className='table-footer'>
                Hiển thị kết quả từ {(page - 1) * limit + 1} -{' '}
                {page * limit > total ? total : page * limit} trong tổng {total}
            </div>
        );
    };

    return (
        <>
            <Table
                size='middle'
                columns={columns}
                dataSource={scripts}
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
                }}
                rowKey={(item) => item._id}
                onChange={onChange}
                sortDirections={['ascend', 'descend']}
                loading={loading}
                pagination={false}
                rowClassName={(record, index) =>
                    index % 2 !== 0 ? 'table-row-dark' : 'table-row-light'
                }
                footer={renderFooter}
            />
        </>
    );
};

export default ScriptTable;
