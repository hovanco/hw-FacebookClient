import * as setingApi from '../../api/setting';
import types from './types';

function loadLabelSuccess(labels: any) {
    return {
        type: types.LOAD_LABEL_SUCCESS,
        payload: labels,
    };
}

export const loadLabels = (pageId: string) => async (dispatch: any, getState: any) => {
    dispatch({ type: types.LOADING });

    const { store } = getState();

    const storeId = store.store._id;

    const response = await setingApi.getListLabels({
        storeId,
        pageId,
        limit: 20,
    });

    dispatch(loadLabelSuccess(response));
};

export function removeLabel(labelId: string) {
    return {
        type: types.REMOVE_LABEL,
        payload: labelId,
    };
}

export function updateOrderLabel(labelId: string, order: number) {
    return {
        type: types.UPDATE_ORDER_LABEL,
        payload: { labelId, order },
    };
}
