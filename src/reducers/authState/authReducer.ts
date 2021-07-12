import types from './authTypes';

interface IAction {
    type: string;
    payload: any;
}

interface Token {}

export interface User {}

export interface IAuthState {
    loading: boolean;
    isAuth: boolean;
    isLogout: boolean;
    token: Token;
    user: User;
}

const initialState = {
    loading: true,
    isAuth: false,
    isLogout: false,
    token: {},
    user: {},
};

const authReducer = (state = initialState, action: IAction): IAuthState => {
    switch (action.type) {
        case types.LOADING:
            return { ...state, loading: true };

        case types.LOAD_USER_SUCCESS:
            return {
                ...state,
                user: action.payload,
                loading: false,
                isAuth: true,
            };

        case types.LOGIN_SUCCESSS:
            return {
                ...state,
                token: action.payload,
                isLogout: false,
            };

        case types.UPDATE_TOKEN:
            return {
                ...state,
                token: {
                    ...state.token,
                    accessToken: action.payload,
                },
            };

        case types.LOAD_USER_FAILED:
            return { ...initialState, loading: false };

        case types.LOGOUT:
            return { ...initialState, loading: false, isLogout: action.payload };

        default:
            return state;
    }
};

export default authReducer;
