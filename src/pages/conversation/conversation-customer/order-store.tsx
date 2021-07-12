import { Form, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWarehouses } from '../../../reducers/warehouseState/warehouseAction';
import { useOrder } from './context-order';

const FormItem = Form.Item;
const style = { margin: '10px 0' };
const LIMIT = 20;

const OrderStore = () => {
    const { order, setOrder } = useOrder();
    const [page, setPage] = useState(1);
    const [dataWarehouse, setDataWarehouse] = useState<any[]>([]);
    const warehouses = useSelector(
        ({ warehouse }: { warehouse: any }) => warehouse.warehouses.data
    );
    const total = useSelector(({ warehouse }: { warehouse: any }) => warehouse.warehouses.total);

    const dispatch = useDispatch();
    const [formStore] = Form.useForm();

    useEffect(() => {
        dispatch(fetchWarehouses({ page: 1, limit: LIMIT }));
        setDataWarehouse(warehouses);
    }, []);

    useEffect(() => {
        if (warehouses) {
            page === 1
                ? setDataWarehouse(warehouses)
                : setDataWarehouse(dataWarehouse.concat(warehouses));
        }
    }, [warehouses]);

    const handleSelectWarehouse = (warehouseId: string) => {
        setOrder({ ...order, warehouseId });
    };

    const handleScroll = (e: any) => {
        const maxPage = Math.ceil(total / LIMIT);
        const element = e.target;
        if (
            element.scrollHeight === element.clientHeight + element.scrollTop &&
            page + 1 <= maxPage
        ) {
            setPage(page + 1);
            dispatch(fetchWarehouses({ page: page + 1, limit: LIMIT }));
        }
    };

    formStore.setFieldsValue({
        warehouseId: order.warehouseId,
    });

    const renderWarehouse = () => {
        return (
            <Select
                onPopupScroll={handleScroll}
                onChange={handleSelectWarehouse}
                placeholder='Chọn địa chỉ lấy hàng'
                style={{ width: '100%' }}
                value={order.warehouseId}
            >
                {dataWarehouse.map((warehouse: any) => (
                    <Select.Option key={warehouse._id} value={warehouse._id}>
                        {warehouse.name}
                    </Select.Option>
                ))}
            </Select>
        );
    };

    return (
        <Form form={formStore}>
            <FormItem
                label='Địa chỉ lấy hàng'
                style={{ ...style }}
                rules={[{ required: true, message: 'Chọn địa chỉ lấy hàng' }]}
                name='warehouseId'
                initialValue={order.warehouseId}
            >
                {renderWarehouse()}
            </FormItem>
        </Form>
    );
};

export default OrderStore;
