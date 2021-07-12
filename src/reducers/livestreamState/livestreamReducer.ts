import types from './types';

export interface IAction {
    type: string;
    payload: any;
}

export interface ILiveStream {}

interface IState {
    isLoaded: boolean;
    hasScript: boolean;
    loading: boolean;
    fbPageId?: string;
    scripts: any[];
    name?: string;
    total: number;
    page?: number;
    limit: number;
    startTime?: number;
    endTime?: number;
    sort?: string;
    direction?: string;
    status?: number;
    active?: number;
}

const initialState = {
    isLoaded: false,
    hasScript: false,
    loading: true,
    fbPageId: undefined,
    name: undefined,
    total: 1,
    page: 1,
    limit: 15,
    scripts: [],
    startTime: undefined,
    endTime: undefined,
    sort: 'createdAt',
    direction: 'desc',
    status: undefined,
    active: undefined,
};

const livestreamReducer = (state: IState = initialState, action: IAction) => {
    switch (action.type) {
        case types.LOADING:
            return {
                ...state,
                loading: true,
            };

        case types.SELECT_PAGE:
            return { ...state, fbPageId: action.payload };

        case types.CHANGE_PAGE:
            return { ...state, page: action.payload };

        case types.CHANGE_NAME:
            return { ...state, name: action.payload };

        case types.CHANGE_DATE: {
            return { ...state, startTime: action.payload[0], endTime: action.payload[1] };
        }

        case types.CHANGE_FILTER:
            return {
                ...state,
                ...action.payload,
            };

        case types.UPDATE_SCRIPT: {
            const new_scripts = state.scripts.map((script: any) => {
                if (script._id === action.payload._id) return action.payload;
                return script;
            });

            return {
                ...state,
                scripts: new_scripts,
            };
        }

        case types.LOAD_FAILED:
            return { ...state, loading: false };

        case types.LOAD_SUCCESS: {
            const { scripts, total } = action.payload;
            const hasScript = state.hasScript || scripts.length > 0;
            return {
                ...state,
                isLoaded: true,
                scripts,
                hasScript,
                total,
                loading: false,
            };
        }

        default:
            return state;
    }
};

export default livestreamReducer;
