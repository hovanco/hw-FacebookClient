import { push } from 'connected-react-router';
import { Dispatch } from 'redux';

import { loadConversation } from '../api/conversation-api';
import { connectFanpageApi, loadFanpages, Payload } from '../api/fanpage';
import types from '../reducers/fanpageState/fanpageTypes';

export const connectFanpageAction = (data: Payload) => async (
    dispatch: Dispatch<any>,
    getState: () => any
) => {
    const { auth, store } = getState();
    const { token } = auth;
    const storeId = store.store._id;

    try {
        const res = await connectFanpageApi({
            payload: data,
            storeId,
            token: token.accessToken,
        });
        dispatch({
            type: types.CONNECT_FANPAGE_SUCCESSS,
            payload: res.data,
        });

        dispatch(loadFanpageAction());
    } catch (e) {
        dispatch({
            type: types.CONNECT_FANPAGE_FAILED,
        });
    }
};

export const loadFanpageAction = () => async (dispatch: Dispatch, getState: any) => {
    const { store } = getState();

    if (store.store) {
        try {
            dispatch({
                type: types.LOAD_FANPAGES,
            });

            const res = await loadFanpages(store.store._id);

            dispatch({
                type: types.LOAD_FANPAGES_SUCCESS,
                payload: res.data,
            });

            dispatch(push('/customer'));
        } catch (error) {
            dispatch({ type: types.LOAD_FANPAGES_FAILED });
        }
    }
};

export const loadConversations = () => async (dispatch: any, getState: any) => {
    dispatch({
        type: types.LOADING_CONVERSATIONS,
    });

    try {
        const { store, auth } = getState();

        const storeId = store.store._id;
        const token = auth.token.accessToken;

        const responses = await loadConversation({
            fbPageIds: [],
            storeId,
            token,
        });

        dispatch({
            type: types.LOAD_CONVERSATIONS_SUCCESS,
            payload: responses,
        });
    } catch (error) {
        dispatch({
            type: types.LOAD_CONVERSATIONS_FAILED,
        });
    }
};
