import {
    CheckOutlined,
    CloseOutlined,
    ReloadOutlined,
    PlusOutlined,
    DashOutlined,
} from '@ant-design/icons';
import {
    Button,
    Col,
    Divider,
    Input,
    InputNumber,
    Row,
    Table,
    AutoComplete,
    message,
    Modal,
    Dropdown,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { FC, useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
    deleteWarehouse,
    fetchWarehouses,
    updateWarehouse,
} from '../../reducers/warehouseState/warehouseAction';
import Action from './action';
import BtnRemoveWarehouse from './btn-remove-warehouse';
import { IWarehouse } from './interface';
import FormAddWarehouse from './form-add-warehouse';
import { IStoreState } from '../../reducers/storeState/storeReducer';

const LIMIT = 20;

const WarehousesTable: FC = (): JSX.Element => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selected, setSelected] = useState<any | null>(null);
    const [page, setPage] = useState<number>(1);
    const [visible, setVisible] = useState<boolean>(false);

    const dispatch = useDispatch();
    const warehouses = useSelector(
        ({ warehouse }: { warehouse: any }) => warehouse.warehouses.data
    );
    const total = useSelector(({ warehouse }: { warehouse: any }) => warehouse.warehouses.total);
    const loading = useSelector(({ warehouse }: { warehouse: any }) => warehouse.loading);
    const store = useSelector(({ store }: { store: IStoreState }) => store.store);

    const [dataSource, setDataSource] = useState(
        (warehouses || []).map((i: IWarehouse) => ({
            ...i,
            key: i._id,
        }))
    );

    const reloadTable = () => {
        dispatch(fetchWarehouses({ page, limit: LIMIT }));
        setSelectedRowKeys([]);
    };

    const refreshWarehouses = () => {
        onChangePage(1);
    };

    useEffect(() => {
        dispatch(fetchWarehouses({ page: 1, limit: LIMIT }));
    }, []);

    useEffect(() => {
        setDataSource(
            (warehouses || []).map((i: IWarehouse) => ({
                ...i,
                key: i._id,
            }))
        );
    }, [warehouses]);

    const columns: ColumnsType<any> | undefined = [
        {
            title: <span className='th'>Tên</span>,
            dataIndex: '',
            key: 'name',
            render: ({ name }) => {
                return name;
            },
        },
        {
            title: <span className='th'>Số điện thoại</span>,
            dataIndex: '',
            key: 'phoneNo',
            render: ({ phoneNo }) => {
                return phoneNo;
            },
        },
        {
            title: <span className='th'>Tỉnh/ Thành phố</span>,
            dataIndex: '',
            key: 'province',
            render: ({ provinceName }) => {
                return provinceName;
            },
        },
        {
            title: <span className='th'>Quận/ Huyện</span>,
            dataIndex: '',
            key: 'district',
            render: ({ districtName }) => {
                return districtName;
            },
        },
        {
            title: <span className='th'>Phường/ Xã</span>,
            dataIndex: '',
            key: 'ward',
            render: ({ wardName }) => {
                return wardName;
            },
        },
        {
            title: <span className='th'>Địa chỉ</span>,
            dataIndex: '',
            key: 'address',
            render: ({ address }) => {
                return address;
            },
        },
        {
            title: '',
            dataIndex: '',
            align: 'right',
            key: 'x',
            render: (warehouse) => {
                const onEdit = () => {
                    setSelected(warehouse);
                    toggle();
                };

                const removeWarehouse = () => {
                    dispatch(deleteWarehouse(warehouse._id));
                };

                const onCancel = () => {
                    setSelected(null);
                };

                if (store.role !== 0) {
                    return (
                        <div style={{ textAlign: 'right' }}>
                            <Button type='primary' icon={<DashOutlined />} disabled={true}></Button>
                        </div>
                    );
                }

                return (
                    <div style={{ textAlign: 'right' }}>
                        {selected && selected._id === warehouse._id ? (
                            <Button loading={true} type='primary'></Button>
                        ) : (
                            <Action
                                warehouse={warehouse}
                                removeWarehouse={removeWarehouse}
                                onCancel={onCancel}
                                onEdit={onEdit}
                            />
                        )}
                    </div>
                );
            },
        },
    ];

    const onSelectChange = (selectedRows: any) => {
        let data = selectedRows;
        if (selectedRows.includes(store.warehouseId)) {
            data = selectedRows.filter((item: any) => item !== store.warehouseId);
        }
        setSelectedRowKeys(data);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const onChangePage = (page: number, pageSize?: number | undefined) => {
        setPage(page);
        dispatch(fetchWarehouses({ page, limit: pageSize || LIMIT }));
    };

    const resetSelect = () => {
        setSelectedRowKeys([]);
    };

    const toggle = () => {
        if (visible) {
            setSelected(null);
        }
        setVisible(!visible);
    };

    const createNew = () => {
        setSelected(null);
        toggle();
    };

    const onCancelForm = () => {
        setSelected(null);
    };

    return (
        <>
            <Row style={{ marginBottom: 20 }} justify='space-between' align='middle'>
                <Col>
                    <Row justify='space-between' align='middle'>
                        <Col>
                            <Button
                                type='primary'
                                icon={<PlusOutlined />}
                                onClick={createNew}
                                disabled={store.role !== 0}
                            >
                                Thêm
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                onClick={refreshWarehouses}
                                style={{ margin: '0 10px' }}
                                icon={<ReloadOutlined />}
                            ></Button>
                        </Col>
                    </Row>
                </Col>
                <Col>
                    {selectedRowKeys.length > 0 && store.role === 0 && (
                        <BtnRemoveWarehouse
                            warehouses={selectedRowKeys}
                            resetSelect={resetSelect}
                            page={page}
                            limit={LIMIT}
                        />
                    )}
                </Col>
            </Row>

            <Table
                loading={loading}
                rowSelection={store.role === 0 ? rowSelection : undefined}
                dataSource={dataSource}
                columns={columns}
                rowKey='_id'
                pagination={{
                    onChange: onChangePage,
                    current: page,
                    total,
                    pageSize: LIMIT,
                }}
            />

            <Modal
                visible={visible}
                onCancel={toggle}
                onOk={toggle}
                title={selected ? 'Cập nhật chi nhánh' : 'Tạo mới chi nhánh'}
                footer={null}
                afterClose={onCancelForm}
                destroyOnClose
            >
                <FormAddWarehouse
                    reloadTable={reloadTable}
                    toggle={toggle}
                    warehouse={selected}
                    visible={visible}
                />
            </Modal>
        </>
    );
};

export default WarehousesTable;
