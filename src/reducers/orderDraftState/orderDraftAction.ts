import types from './orderDraftType';
import { Dispatch } from 'redux';
import { fetchOrdersRequest, removeOrdersRequest } from '../../api/order-api';
import { message } from 'antd';

export function loadOrdersDraftSuccess(data: any) {
    return {
        type: types.LOAD_ORDER_DRAFT_SUCCESS,
        payload: data,
    };
}

export function loadOrdersDraftFailed() {
    return {
        type: types.LOAD_ORDER_DRAFT_FAILED,
    };
}

export const loadOrdersDraft = (query: { limit: number; page: number }) => async (
    dispatch: Dispatch,
    getState: () => any
) => {
    dispatch({
        type: types.LOADING_ORDER_DRAFT,
    });

    try {
        const { auth, store } = getState();
        const { token } = auth;
        const storeId = store.store._id;

        const res = await fetchOrdersRequest({
            token: token.accessToken,
            storeId,
            query: {
                ...query,
                draft: true,
            },
        });

        dispatch(loadOrdersDraftSuccess(res));
    } catch (error) {
        dispatch(loadOrdersDraftFailed());
    }
};

export const removeOrdersDraft = (orderId: string) => async (
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
            type: types.DELETE_ORDER_DRAFT_SUCCESS,
            payload: orderId,
        });

        message.success('Xoá đơn hàng thành công');
    } catch (error) {
        message.error('Lỗi xoá đơn hàng');
    }
};
