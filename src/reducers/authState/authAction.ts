import { Dispatch } from 'redux';
import { loginApi, Payload } from '../../api';
import authApi from '../../api/auth-api';
import { connectFanpageApi } from '../../api/fanpage';
import storeApi from '../../api/store-api';
import { getToken, removeToken } from '../../api/token';
import { getUserApi } from '../../api/user';
import { connectFanpageSuccess } from '../fanpageState/fanpageAction';
import { loadingStore, loadStore, loadStoreSuccess } from '../storeState/storeAction';
import types from './authTypes';

// load user
const loadingUser = () => ({ type: types.LOADING });

const loadUserSuccess = (payload: any) => ({
    type: types.LOAD_USER_SUCCESS,
    payload,
});

export const getUserAction = () => async (dispatch: Dispatch<any>) => {
    try {
        dispatch(loadingUser());

        const res = await getUserApi();

        await dispatch(loadUserSuccess(res.data));
        await dispatch(loadStore());
    } catch (error) {
        dispatch({
            type: types.LOAD_USER_FAILED,
        });
    }
};

// login with email
export const loginActionWithEmail = (payload: any) => (dispatch: any) => {
    dispatch({
        type: types.LOGIN_SUCCESSS,
        payload,
    });

    dispatch(getUserAction());
};

// login with service
export const loginActionWithService = (data: Payload, service?: any) => async (dispatch: any) => {
    try {
        dispatch(loadingUser());
        const res = await loginApi(data, service);

        dispatch({
            type: types.LOGIN_SUCCESSS,
            payload: res.data,
        });

        // load user
        const res_user = await getUserApi();

        // load store
        dispatch(loadingStore());
        const response_store = await storeApi.loadStore(res.data.accessToken);
        await dispatch(loadStoreSuccess(response_store));

        if (service === 'facebook') {
            // add shortLiveToken to localStorage
            if (data.accessToken) {
                localStorage.setItem('shortLiveToken', data.accessToken);
            }

            // connect fanpage
            if (response_store) {
                const response_connect_fanpage = await connectFanpageApi({
                    payload: { shortLiveToken: data.accessToken },
                    storeId: response_store._id,
                    token: res.data.accessToken,
                });
                await dispatch(connectFanpageSuccess(response_connect_fanpage.data));
            }
        }

        await dispatch(loadUserSuccess(res_user.data));
    } catch (e) {
        dispatch({
            type: types.LOGIN_FAILED,
        });
    }
};

// logout
export const logout = (value?: boolean) => async (dispatch: Dispatch<any>) => {
    try {
        const refreshToken = getToken('refreshToken');

        if (refreshToken) {
            await authApi.logout(refreshToken);
        }

        removeToken();

        dispatch({
            type: types.LOGOUT,
            payload: typeof value === 'boolean' ? value : true,
        });
    } catch (error) {}
};
