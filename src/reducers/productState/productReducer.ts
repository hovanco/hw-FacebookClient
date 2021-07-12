import types from './productTypes';

export interface IAction {
    type: string;
    payload: any;
}

export interface IProducts {
    data: any[];
    total: number;
}

const initialState = {
    loading: false,
    loadingCreateProduct: false,
    products: {
        data: [],
        total: 0,
    },
    category: [],
    categoryId: '',
};

const productReducer = (state = initialState, action: IAction) => {
    switch (action.type) {
        case types.FETCH_PRODUCTS_LOADING:
            return {
                ...state,
                loading: true,
            };

        case types.FETCH_PRODUCTS_SUCCESS:
            return {
                ...state,
                products: action.payload,
                loading: false,
            };

        case types.FETCH_PRODUCTS_FAILED:
            return {
                ...state,
                products: {},
                loading: false,
            };

        case types.CREATE_PRODUCT_LOADING:
            return {
                ...state,
                loadingCreateProduct: true,
            };

        case types.DELETE_PRODUCT_SUCCESS:
            const cloneProducts = (state.products.data || []).filter(
                (o: any) => o._id !== action.payload
            );

            return {
                ...state,
                products: {
                    ...state.products,
                    data: [...cloneProducts],
                },
            };

        case types.DELETE_PRODUCT_FAILED:
            return {
                ...state,
            };

        case types.FETCH_CATEGORY_SUCCESS:
            return {
                ...state,
                category: action.payload,
            };

        case types.FETCH_CATEGORY_FAILED:
            return {
                ...state,
                category: [],
            };

        case types.SET_NEW_CATEGORY_SUCCESS:
            return {
                ...state,
                categoryId: action.payload,
            };

        default:
            return state;
    }
};

export default productReducer;
