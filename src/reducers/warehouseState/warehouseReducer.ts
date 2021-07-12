import types from './warehouseTypes';

export interface IAction {
    type: string;
    payload: any;
}

export interface IWarehouses {
    data: any[];
    total: number;
}

const initialState = {
    loading: false,
    loadingCreateWarehouse: false,
    warehouses: {
        data: [],
        total: 0,
    },
};

const warehouseReducer = (state = initialState, action: IAction) => {
    switch (action.type) {
        case types.FETCH_WAREHOUSES_LOADING:
            return {
                ...state,
                loading: true,
            };

        case types.FETCH_WAREHOUSES_SUCCESS:
            return {
                ...state,
                warehouses: { data: action.payload.data, total: action.payload.total },
                loading: false,
            };

        case types.FETCH_WAREHOUSES_FAILED:
            return {
                ...state,
                warehouses: {},
                loading: false,
            };

        case types.CREATE_WAREHOUSE_LOADING:
            return {
                ...state,
                loadingCreateWarehouse: true,
            };

        case types.DELETE_WAREHOUSE_SUCCESS:
            const cloneWarehouses = (state.warehouses.data || []).filter(
                (o: any) => o._id !== action.payload
            );

            return {
                ...state,
                warehouses: {
                    ...state.warehouses,
                    data: [...cloneWarehouses],
                },
            };

        case types.DELETE_WAREHOUSE_FAILED:
            return {
                ...state,
            };

        default:
            return state;
    }
};

export default warehouseReducer;
