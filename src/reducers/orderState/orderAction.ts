import { Dispatch } from 'redux';
import { message } from 'antd';

import { IAction } from '../imagesState/interfaces';
import types from './orderTypes';

import {
    fetchOrdersRequest,
    updateStatusOrdersRequest,
    removeOrdersRequest,
} from '../../api/order-api';

export function setOrders(data: any): IAction {
    return {
        type: types.FETCH_ORDERS_SUCCESS,
        payload: data,
    };
}

export function changeOrderType(type: string): IAction {
    return {
        type: types.CHANGE_ORDER_TYPE,
        payload: type,
    };
}

export const fetchOrders = (query: { status?: string; page: number; limit: number }) => async (
    dispatch: Dispatch,
    getState: () => any
) => {
    try {
        dispatch({
            type: types.FETCH_ORDERS_LOADING,
        });

        const { auth, store } = getState();
        const { token } = auth;
        const storeId = store.store._id;

        const res = await fetchOrdersRequest({
            token: token.accessToken,
            storeId,
            query,
        });

        dispatch(setOrders(res));
    } catch (error) {
        message.error('Lỗi tải đơn hàng');
        dispatch({ type: types.FETCH_ORDERS_FAILED });
    }
};

export const updateStatusOrders = (orderId: string, status: string) => async (
    dispatch: Dispatch,
    getState: () => any
) => {
    try {
        const { auth, store } = getState();
        const { token } = auth;
        const storeId = store.store._id;

        const res = await updateStatusOrdersRequest({
            token: token.accessToken,
            storeId,
            orderId,
            data: { status },
        });

        if (res) {
            dispatch({
                type: types.UPDATE_STATUS_ORDER_SUCCESS,
                payload: res,
            });
            return message.success('Chỉnh sửa trạng thái thành công');
        }
        message.error('Lỗi chỉnh sửa trạng thái');
    } catch (error) {
        message.error('Lỗi chỉnh sửa trạng thái');
    }
};

export const removeOrders = (orderId: string) => async (
    dispatch: Dispatch,
    getState: () => any
) => {
    try {
        const { auth, store } = getState();
        const { token } = auth;
        const storeId = store.store._id;

        const res = await removeOrdersRequest({
            token: token.accessToken,
            storeId,
            orderId,
        });

        dispatch({
            type: types.DELETE_ORDER_SUCCESS,
            payload: orderId,
        });
        message.success('Xoá đơn hàng thành công');
    } catch (error) {
        message.error('Lỗi xoá đơn hàng');
    }
};
