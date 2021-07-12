import { keyBy } from 'lodash';

import * as types from './actionTypes';

interface IAction {
    type: string;
    payload: any;
}

export interface IState {
    loading: boolean;
    quickMessage: any;
    defaultActiveKey: string;
}

const initialState = {
    loading: false,
    quickMessage: {},
    defaultActiveKey: 'general',
};

const settingReducer = (state: IState = initialState, action: IAction): IState => {
    switch (action.type) {
        case types.LOAD_QUICK_MESSAGE:
            return {
                ...state,
                loading: true,
            };
        case types.LOAD_QUICK_MESSAGE_SUCCESS:
            return {
                ...state,
                quickMessage: keyBy(action.payload, '_id'),
                loading: false,
            };
        case types.LOAD_QUICK_MESSAGE_FAILED:
            return {
                ...state,
                loading: false,
            };
        case types.CREATE_QUICK_MESSAGE:
            return {
                ...state,
                loading: true,
            };
        case types.CREATE_QUICK_MESSAGE_SUCCESS:
            return {
                ...state,
                quickMessage: {
                    ...state.quickMessage,
                    [action.payload._id]: action.payload,
                },
                loading: false,
            };
        case types.CREATE_QUICK_MESSAGE_FAILED:
            return {
                ...state,
                loading: false,
            };
        case types.UPDATE_QUICK_MESSAGE:
            return {
                ...state,
                loading: true,
            };
        case types.UPDATE_QUICK_MESSAGE_SUCCESS:
            return {
                ...state,
                quickMessage: {
                    ...state.quickMessage,
                    [action.payload._id]: action.payload,
                },
                loading: false,
            };
        case types.UPDATE_QUICK_MESSAGE_FAILED:
            return {
                ...state,
                loading: false,
            };
        case types.DELETE_QUICK_MESSAGE:
            return {
                ...state,
                loading: true,
            };
        case types.DELETE_QUICK_MESSAGE_SUCCESS: {
            const { quickId } = action.payload;
            let newState = Object.assign({}, state.quickMessage);
            delete newState[quickId];

            return {
                ...state,
                quickMessage: newState,
                loading: false,
            };
        }
        case types.DELETE_QUICK_MESSAGE_FAILED:
            return {
                ...state,
                loading: false,
            };
        case types.DEFAULT_ACTIVE_KEY: {
            const { defaultActiveKey } = action.payload;
            return {
                ...state,
                defaultActiveKey,
            };
        }
        default:
            return state;
    }
};

export default settingReducer;
