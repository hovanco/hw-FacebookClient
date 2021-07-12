import typesAuth from '../authState/authTypes';
import types from './storeTypes';

export interface Store {}

export interface IStoreState {
    loading: boolean;
    store: any;
}

export interface IAction {
    type: string;
    payload?: any;
}

const initialState: IStoreState = {
    loading: true,
    store: null,
};

function storeReducer(state = initialState, action: IAction): IStoreState {
    switch (action.type) {
        case types.LOADING_STORE:
            return { ...state, loading: true };

        case types.LOAD_STORE_SUCCESS:
            return { ...state, store: action.payload, loading: false };

        case types.LOAD_STORE_FAILED:
            return { ...state, loading: false };

        case types.UPDATE_STORE: {
            return { ...state, store: { ...action.payload, role: state.store.role } };
        }

        case types.CHANGE_PAGE:
            return {
                ...state,
                store: {
                    ...state.store,
                    activePage: action.payload,
                },
            };

        case types.ADD_STORE:
            return { ...state, store: action.payload };

        case typesAuth.LOGOUT:
            return initialState;

        default:
            return state;
    }
}

export default storeReducer;
