import { find, pick } from 'lodash';
import livestreamApi from '../../api/livestream-api';
import types from './types';

export function loadLiveStreamStart() {
    return {
        type: types.LOADING,
    };
}

export function loadLiveStreamSuccess(data: any) {
    return {
        type: types.LOAD_SUCCESS,
        payload: data,
    };
}

export function loadLiveStreamFailed() {
    return {
        type: types.LOAD_SUCCESS,
    };
}

export function selectPage(pageId: string) {
    return {
        type: types.SELECT_PAGE,
        payload: pageId,
    };
}

export function updateCurrentPageOfPagination(page: number) {
    return {
        type: types.CHANGE_PAGE,
        payload: page,
    };
}
export function changeName(name: string) {
    return {
        type: types.CHANGE_NAME,
        payload: name,
    };
}

export function changeDate(dates: number[]) {
    return {
        type: types.CHANGE_DATE,
        payload: dates,
    };
}

export function changeFilter(values: any) {
    return {
        type: types.CHANGE_FILTER,
        payload: values,
    };
}

export function updateScript(script: any) {
    return {
        type: types.UPDATE_SCRIPT,
        payload: script,
    };
}

export const loadLivestreams = () => async (dispatch: any, getState: any) => {
    dispatch({ type: types.LOADING });

    const { livestream, store, fanpage } = getState();

    const getFbPageId = () => {
        const { pages } = fanpage;
        if (Object.keys(pages).length === 0) return null;

        const page = find(pages, (page: any) => page.fbObjectId === livestream.fbPageId);

        if (page) {
            return page.fbObjectId;
        }

        return pages[Object.keys(pages)[0]].fbObjectId;
    };

    const fbPageId = getFbPageId();

    dispatch(selectPage(fbPageId));

    try {
        const response = await livestreamApi.loadLiveStream({
            storeId: store.store._id,
            fbPageId,
            ...pick(livestream, [
                'limit',
                'page',
                'name',
                'startTime',
                'endTime',
                'sort',
                'direction',
                'status',
                'active',
            ]),
        });

        dispatch(loadLiveStreamSuccess(response));
    } catch (error) {
        dispatch(loadLiveStreamFailed());
    }
};
