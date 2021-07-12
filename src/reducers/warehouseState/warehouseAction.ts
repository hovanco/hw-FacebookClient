import { message } from 'antd';
import { get } from 'lodash';
import { Dispatch } from 'redux';
import {
    createWarehouseRequest,
    deleteWarehouseRequest,
    fetchWarehousesRequest,
    updateWarehouseRequest,
} from '../../api/warehouse-api';
import { IAction } from './warehouseReducer';
import types from './warehouseTypes';
import { updateStore } from '../storeState/storeAction';

export function setWarehouses(data: any): IAction {
    return {
        type: types.FETCH_WAREHOUSES_SUCCESS,
        payload: data,
    };
}

export const fetchWarehouses = (query: { page: number; limit: number }) => async (
    dispatch: Dispatch,
    getState: () => any
) => {
    try {
        dispatch({
            type: types.FETCH_WAREHOUSES_LOADING,
        });

        const { auth, store } = getState();
        const { token } = auth;
        const storeId = store.store._id;

        const res = await fetchWarehousesRequest({
            token: token.accessToken,
            storeId,
            query,
        });

        dispatch(setWarehouses(res));
    } catch (error) {
        dispatch({ type: types.FETCH_WAREHOUSES_FAILED });
    }
};

export const createWarehouse = (data: any) => async (dispatch: Dispatch, getState: () => any) => {
    try {
        dispatch({
            type: types.CREATE_WAREHOUSE_LOADING,
        });

        const { auth, store } = getState();
        const { token } = auth;
        const storeId = store.store._id;

        const res = await createWarehouseRequest({
            token: token.accessToken,
            storeId,
            data,
        });
        if (res) {
            message.success('Tạo mới chi nhánh thành công');
            return res;
        }
    } catch (error) {
        message.error('Tạo chi nhánh mới thất bại');
        dispatch({ type: types.CREATE_WAREHOUSE_FAILED });
        return;
    }
};

export const updateWarehouse = (data: any) => async (dispatch: Dispatch, getState: () => any) => {
    try {
        const { auth, store } = getState();
        const { token } = auth;
        const storeId = store.store._id;

        const res = await updateWarehouseRequest({
            token: token.accessToken,
            storeId,
            warehouseId: data._id,
            data: { ...data, storeId },
        });
        if (res) {
            if (store.store.warehouseId === data._id) {
                dispatch(
                    updateStore({
                        ...store.store,
                        province: res.province,
                        district: res.district,
                        ward: res.ward,
                        phoneNo: res.phoneNo,
                        address: res.address,
                    })
                );
            }
            message.success('Cập nhật chi nhánh thành công');
            return res;
        }
    } catch (error) {
        if (get(error, 'response.data.message') === 'NOT_ALLOW_CHANGING_ADDRESS') {
            message.error(
                'Bạn không thể thay đổi địa chỉ chi nhánh. Vui lòng liên hệ nhân viên hỗ trợ để được trợ giúp.'
            );
        } else {
            message.error('Cập nhật không thành công');
        }
        dispatch({ type: types.UPDATE_WAREHOUSE_FAILED });
        return;
    }
};

export const deleteWarehouse = (warehouseId: string) => async (
    dispatch: Dispatch,
    getState: () => any
) => {
    try {
        const { auth, store } = getState();
        const { token } = auth;
        const storeId = store.store._id;

        const res = await deleteWarehouseRequest({
            token: token.accessToken,
            storeId,
            warehouseId,
        });
        if (res) {
            message.success('Đã xoá 1 chi nhánh');
        }

        dispatch({ type: types.DELETE_WAREHOUSE_SUCCESS, payload: warehouseId });
    } catch (error) {
        if (get(error, 'response.data.message') === 'HAS_RELATED_ORDER') {
            message.error('Đã tạo đơn với chi nhánh này, bạn không thể xóa chi nhánh');
        } else {
            message.error('Lỗi xóa chi nhánh');
        }
        dispatch({ type: types.DELETE_WAREHOUSE_FAILED });
    }
};
