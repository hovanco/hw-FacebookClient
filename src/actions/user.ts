import { push } from 'connected-react-router';
import { Dispatch } from 'redux';

import { getUserApi } from '../api/user';
import types from '../reducers/authState/authTypes';
import { loadStore } from '../reducers/storeState/storeAction';

const loadingUser = () => ({ type: types.LOADING });

const loadUserSuccess = (payload: any) => ({
    type: types.LOAD_USER_SUCCESS,
    payload,
});

export const getUserAction = () => async (dispatch: any) => {
    try {
        dispatch(loadingUser());
        const res = await getUserApi();

        dispatch(loadUserSuccess(res.data));
        dispatch(loadStore());
    } catch (error) {
        // dispatch(push('/login'));
        dispatch({
            type: types.LOAD_USER_FAILED,
        });
    }
};
