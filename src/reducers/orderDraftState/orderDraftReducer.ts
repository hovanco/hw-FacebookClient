import { IAction } from '../imagesState/interfaces';
import types from './orderDraftType';

const initialState = {
    loading: false,
    orders: {
        data: [],
        total: 0,
    },
};

const orderDraftReducer = (state = initialState, action: IAction) => {
    switch (action.type) {
        case types.LOADING_ORDER_DRAFT:
            return { ...state, loading: true };

        case types.LOAD_ORDER_DRAFT_SUCCESS:
            return { ...state, orders: action.payload, loading: false };
        case types.LOAD_ORDER_DRAFT_FAILED:
            return { ...state, loading: false };

        case types.DELETE_ORDER_DRAFT_SUCCESS: {
            const cloneOrder = state.orders.data.filter(
                (item: { _id: string }) => item._id !== action.payload
            );
            return {
                ...state,
                orders: { ...state.orders, data: cloneOrder },
                loading: false,
            };
        }

        default:
            return state;
    }
};

export default orderDraftReducer;
