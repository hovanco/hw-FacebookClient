import types from './staffType';
import { Dispatch } from 'redux';
import staffApi from '../../api/staff-api';
import { IAction, IStaff } from './staffReducer';

function loadStaffSuccess(staffs: IStaff[]): IAction {
    return {
        type: types.LOAD_STAFF_SUCCESS,
        payload: staffs,
    };
}

export function updateStaff(data: any) {
    return {
        type: types.UPDATE_STAFF,
        payload: data,
    };
}

export function addStaff(staff: IStaff) {
    return {
        type: types.ADD_STAFF,
        payload: staff,
    };
}

export function deleteStaff(staffId: string) {
    return {
        type: types.DELETE_STAFF,
        payload: staffId,
    };
}

export const loadStaffs = () => async (dispatch: Dispatch, getState: any): Promise<any> => {
    dispatch({
        type: types.LOADING,
    });
    try {
        const { store, auth } = getState();
        const storeId = store.store._id;
        const token = auth.token.accessToken;
        const response = await staffApi.listStaff({ storeId, token });

        dispatch(loadStaffSuccess(response));
    } catch (error) {
        dispatch(loadStaffSuccess([]));
    }
};
