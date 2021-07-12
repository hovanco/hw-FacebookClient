import * as types from './actionTypes';

export function setDefaultActiveKey(defaultActiveKey: string) {
    return {
        type: types.DEFAULT_ACTIVE_KEY,
        payload: { defaultActiveKey },
    };
}
