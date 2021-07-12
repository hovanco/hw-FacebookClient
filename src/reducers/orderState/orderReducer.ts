import types from './orderTypes';

import { IAction } from '../imagesState/interfaces';

const initialState = {
    loading: false,
    orders: {
        data: [],
        total: 0,
    },
    type: 'all',
};

const orderReducer = (state = initialState, action: IAction) => {
    switch (action.type) {
        case types.FETCH_ORDERS_LOADING:
            return {
                ...state,
                loading: true,
            };

        case types.CHANGE_ORDER_TYPE:
            return {
                ...state,
                type: action.payload,
            };

        case types.FETCH_ORDERS_SUCCESS:
            return {
                ...state,
                orders: action.payload,
                loading: false,
            };

        case types.FETCH_ORDERS_FAILED:
            return {
                ...state,
                loading: false,
            };

        case types.UPDATE_STATUS_ORDER_SUCCESS: {
            const new_orders_data = state.orders.data.map((order: any) => {
                if (order._id === action.payload._id) {
                    return { ...order, status: action.payload.status };
                }
                return order;
            });

            return {
                ...state,
                orders: {
                    ...state.orders,
                    data: new_orders_data,
                },
            };
        }

        case types.DELETE_ORDER_SUCCESS:
            const cloneOrder = state.orders.data.filter(
                (item: { _id: string }) => item._id !== action.payload
            );
            return {
                ...state,
                orders: { ...state.orders, data: cloneOrder },
                loading: false,
            };

        default:
            return state;
    }
};

export default orderReducer;
