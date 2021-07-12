import { DeleteOutlined } from '@ant-design/icons';
import { Button, message, Modal } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteWarehouseRequest } from '../../api/warehouse-api';
import { fetchWarehouses } from '../../reducers/warehouseState/warehouseAction';
import { get } from 'lodash';

interface Props {
    warehouses: string[];
    resetSelect: () => void;
    limit: number;
    page: number;
}

const BtnRemoveWarehouse = ({ warehouses, resetSelect, limit, page }: Props) => {
    const dispatch = useDispatch();
    const store = useSelector((state: any) => state.store.store);
    const token = useSelector((state: any) => state.auth.token);

    const [loading, setLoading] = useState(false);

    const showDeleteConfirm = () => {
        Modal.confirm({
            title: 'Xóa chi nhánh?',
            content: `Bạn chắc chắn muốn xóa những chi nhánh đã chọn?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            width: 450,
            onOk() {
                removeMoreWarehouses();
            },
            onCancel() {},
        });
    };

    const removeMoreWarehouses = async () => {
        try {
            setLoading(true);

            const response = await Promise.all(
                warehouses.map(async (warehouseId: string) => {
                    await deleteWarehouseRequest({
                        token: token.accessToken,
                        storeId: store._id,
                        warehouseId,
                    });
                    return warehouseId;
                })
            );

            message.success('Đã xóa chi nhánh');
            setLoading(false);
            resetSelect();
            dispatch(
                fetchWarehouses({
                    page,
                    limit,
                })
            );
        } catch (error) {
            if (get(error, 'response.data.message') === 'HAS_RELATED_ORDER') {
                message.error('Đã tạo đơn với chi nhánh này, bạn không thể xóa chi nhánh');
            } else {
                message.error('Lỗi xóa chi nhánh');
            }
            dispatch(
                fetchWarehouses({
                    page,
                    limit,
                })
            );
            setLoading(false);
        }
    };

    return (
        <Button
            danger
            type='primary'
            icon={<DeleteOutlined />}
            onClick={showDeleteConfirm}
            loading={loading}
        >
            Xóa
        </Button>
    );
};

export default BtnRemoveWarehouse;
