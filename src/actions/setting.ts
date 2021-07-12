import { Dispatch } from 'redux';
import { message } from 'antd';
import { get } from 'lodash';

import * as types from '../reducers/setting/actionTypes';
import {
    loadQuickMessage,
    createQuickMessage,
    updateQuickMessage,
    deleteQuickMessage,
} from '../api/setting';
import { Payload } from '../reducers/setting/interfaces';

export const loadQuickMessageAction = (data: Payload) => async (dispatch: Dispatch) => {
    try {
        dispatch({
            type: types.LOAD_QUICK_MESSAGE,
        });

        const res = await loadQuickMessage(data);

        dispatch({
            type: types.LOAD_QUICK_MESSAGE_SUCCESS,
            payload: res.data,
        });
    } catch (error) {
        dispatch({ type: types.LOAD_QUICK_MESSAGE_FAILED });
    }
};

export const createQuickMessageAction = (data: Payload) => async (dispatch: Dispatch) => {
    try {
        dispatch({
            type: types.CREATE_QUICK_MESSAGE,
        });

        const res = await createQuickMessage(data);

        dispatch({
            type: types.CREATE_QUICK_MESSAGE_SUCCESS,
            payload: res.data,
        });
        message.success('Tạo tin nhắn nhanh thành công.');
        data.toggle();
    } catch (error) {
        dispatch({ type: types.CREATE_QUICK_MESSAGE_FAILED });
        const errorMessage = get(error, 'response.data.message');
        if (errorMessage === 'SHORTCUT_DUPLICATED') {
            message.error('Phím tắt đã được sử dụng');
        } else {
            message.error('Tạo tin nhắn nhanh thất bại');
        }
        throw new Error('CREATE_FAILED');
    }
};

export const updateQuickMessageAction = (data: Payload) => async (dispatch: Dispatch) => {
    try {
        dispatch({
            type: types.UPDATE_QUICK_MESSAGE,
        });

        const res = await updateQuickMessage(data);

        dispatch({
            type: types.UPDATE_QUICK_MESSAGE_SUCCESS,
            payload: res.data,
        });
        message.success('Sửa tin nhắn nhanh thành công.');
        data.toggle();
    } catch (error) {
        dispatch({ type: types.UPDATE_QUICK_MESSAGE_FAILED });
        const errorMessage = get(error, 'response.data.message');
        if (errorMessage === 'SHORTCUT_DUPLICATED') {
            message.error('Phím tắt đã được sử dụng');
        } else {
            message.error('Chỉnh sửa tin nhắn nhanh thất bại');
        }
        throw new Error('UPDATE_FAILED');
    }
};

export const deleteQuickMessageAction = (data: Payload) => async (dispatch: Dispatch) => {
    try {
        dispatch({
            type: types.DELETE_QUICK_MESSAGE,
        });

        await deleteQuickMessage(data);

        dispatch({
            type: types.DELETE_QUICK_MESSAGE_SUCCESS,
            payload: data,
        });
        message.success('Xoá tin nhắn nhanh thành công.');
    } catch (error) {
        dispatch({ type: types.DELETE_QUICK_MESSAGE_FAILED });
        message.error('Xoá tin nhắn nhanh thất bại');
    }
};
