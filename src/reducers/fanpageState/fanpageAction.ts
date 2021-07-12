import { debounce, get } from 'lodash';
import moment from 'moment';
import { Dispatch } from 'redux';

import {
    getUnreadConversationsCount,
    loadConversation,
    markAsUnreadApi,
} from '../../api/conversation-api';
import { connectFanpageApi, loadFanpages, Payload } from '../../api/fanpage';
import { loadStore } from '../storeState/storeAction';
import { IAction, IConversation, Page } from './fanpageReducer';
import types from './fanpageTypes';

interface IDataSocket {
    conversation: IConversation;
}

export function removeError() {
    return {
        type: types.REMOVE_ERROR_LOAD_FANPAGES,
    };
}
export function setNewMessage(payload: any) {
    return {
        type: types.SET_NEW_MESSAGE,
        payload,
    };
}

export function removeConversations() {
    return {
        type: types.REMOVE_CONVERSATIONS,
    };
}

export function connectFanpageSuccess(payload: any) {
    return {
        type: types.CONNECT_FANPAGE_SUCCESSS,
        payload,
    };
}

export function connectFanpageFailed() {
    return {
        type: types.CONNECT_FANPAGE_FAILED,
    };
}

export const connectFanpageAction = (data: Payload) => async (
    dispatch: Dispatch<any>,
    getState: () => any
) => {
    const { auth, store } = getState();
    const { token } = auth;

    if (store.store) {
        const storeId = store.store._id;

        try {
            const res = await connectFanpageApi({
                payload: data,
                storeId,
                token: token.accessToken,
            });
            dispatch(connectFanpageSuccess(res.data));

            dispatch(loadFanpageAction());
            localStorage.removeItem('shortLiveToken');
        } catch (e) {
            dispatch(connectFanpageFailed());
        }
    } else {
        dispatch(connectFanpageFailed());
    }
};

export const isActivePage = (page: any) => {
    return page.active;
};

export const loadFanpageAction = () => async (dispatch: any, getState: any) => {
    const { auth, store } = getState();
    const { token } = auth;

    if (get(store, 'store._id')) {
        const storeId = store.store._id;
        try {
            dispatch({
                type: types.LOAD_FANPAGES,
            });

            let res = await loadFanpages(store.store._id);

            const getCountPages: Promise<any>[] = [];
            let activePages: any[] = [];
            let inactivePages: any[] = [];
            if (res.data && res.data.length > 0) {
                res.data.forEach((item: any) => {
                    if (isActivePage(item)) {
                        activePages.push(item);
                    } else {
                        inactivePages.push(item);
                    }
                });

                activePages.map((item: any) => {
                    getCountPages.push(
                        getUnreadConversationsCount({
                            token: token.accessToken,
                            storeId,
                            fbPageId: item.fbObjectId,
                        })
                    );
                });

                const response = await Promise.all(getCountPages);
                if (response) {
                    activePages = activePages.map((item: any, index: number) => {
                        item.countUnread = response[index];
                        return item;
                    });
                }
            }

            dispatch({
                type: types.LOAD_FANPAGES_SUCCESS,
                payload: {
                    data: activePages.concat(inactivePages),
                    activePage: store.store.activePage,
                },
            });
        } catch (error) {
            dispatch({ type: types.LOAD_FANPAGES_FAILED });
        }
    } else {
        dispatch(loadStore());
    }
};

export const updateUnreadForConversation = (data: any) => async (dispatch: any, getState: any) => {
    const { auth, store, fanpage } = getState();
    const { token } = auth;
    const storeId = store.store._id;
    const { conversation } = fanpage;

    if (conversation && data.fbObjectId === conversation.fbObjectId) {
        await markAsUnreadApi({
            storeId,
            fbPageId: conversation.fbPageId,
            token: token.accessToken,
            conversationId: conversation.fbObjectId,
            read: true,
        });
        dispatch({
            type: types.MARK_AS_UNREAD,
            payload: { conversation: data, unread: false },
        });
    }
    dispatch(updateCountUnreadPage({ fbObjectId: data.fbPageId }));
};

export const updateCountUnreadPage = (data: { fbObjectId: string }) => async (
    dispatch: Dispatch,
    getState: any
) => {
    const { auth, store } = getState();
    const { token } = auth;
    const storeId = store.store._id;

    debounced(data, token.accessToken, storeId, dispatch);
};

export const debounced = debounce(
    async function (data: any, accessToken: string, storeId: string, dispatch: Dispatch) {
        const count = await getUnreadConversationsCount({
            token: accessToken,
            storeId,
            fbPageId: data.fbObjectId,
        });
        dispatch({
            type: types.UPDATE_COUNT_UNREAD_PAGE,
            payload: { ...data, count },
        });
    },
    1000,
    { leading: false, trailing: true }
);

export const loadConversations = (
    query?: string,
    paramFbPageIds?: string[],
    pageSelected?: any,
    url?: string
) => async (dispatch: any, getState: any) => {
    dispatch({
        type: types.LOADING_CONVERSATIONS,
    });

    try {
        const { store, auth, fanpage } = getState();
        const storeId = store.store._id;
        const token = auth.token.accessToken;
        const fbPageIds = !paramFbPageIds
            ? Object.values(fanpage.pages).map((page: any) => page.fbObjectId)
            : paramFbPageIds;

        const responses = await loadConversation({
            fbPageIds,
            storeId,
            token,
            query,
            url,
        });

        if (pageSelected) {
            const countUnread = await getUnreadConversationsCount({
                token,
                storeId,
                fbPageId: fbPageIds[0],
            });
            pageSelected.countUnread = countUnread;
        }

        dispatch({
            type: types.LOAD_CONVERSATIONS_SUCCESS,
            payload: pageSelected
                ? { conversations: responses, pageSelected }
                : { conversations: responses },
        });
    } catch (error) {
        dispatch({
            type: types.LOAD_CONVERSATIONS_FAILED,
        });
    }
};

export function selectConversation(conversation: IConversation): IAction {
    return {
        type: types.SELECT_CONVERSATION,
        payload: conversation,
    };
}

export function markAsUnread(data: { conversation: IConversation; unread: boolean }): IAction {
    return {
        type: types.MARK_AS_UNREAD,
        payload: data,
    };
}

export function newConversation(data: any): IAction {
    return {
        type: types.NEW_CONVERSATION,
        payload: data,
    };
}

export const updateConversation = (data: any) => (dispatch: any, getState: any) => {
    data.isUpdateMessage = true;

    dispatch({
        type: types.UPDATE_CONVERSATION,
        payload: data,
    });
};

export function updateLabelConversations(data: any): IAction {
    return {
        type: types.UPDATE_LABEL_CONVERSATION,
        payload: data,
    };
}

export function updateLikeCommentsConversation(data: any): IAction {
    return {
        type: types.UPDATE_LIKED_COMMENTS_CONVERSATION,
        payload: data,
    };
}

export function updateHiddenCommentsConversation(data: any): IAction {
    return {
        type: types.UPDATE_HIDDEN_COMMENTS_CONVERSATION,
        payload: data,
    };
}

export function toggleBlockUser(data: any) {
    return {
        type: types.UPDATE_BLOCK_CONVERSATION,
        payload: data,
    };
}

export function setNullForConversation() {
    return {
        type: types.SET_NULL_FOR_CONVERSATION,
    };
}

export function removeConversation(data: { conversationId: string }): IAction {
    return {
        type: types.REMOVE_CONVERSATION,
        payload: data,
    };
}

export function updateMainCommentConversation(data: {
    conversationId: string;
    fbObjectId: string;
    commentIds: string[];
}): IAction {
    return {
        type: types.UPDATE_MAIN_COMMENT_CONVERSATION,
        payload: data,
    };
}

export function setCurrentPage(page: Page): IAction {
    return {
        type: types.SET_CURRENT_PAGE,
        payload: page,
    };
}

export function setFilterConversation(selected: string[]): IAction {
    return {
        type: types.SET_FILTER_CONVERSATION,
        payload: selected,
    };
}
