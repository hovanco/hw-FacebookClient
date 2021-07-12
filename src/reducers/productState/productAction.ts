import { message } from 'antd';
import { get } from 'lodash';
import { Dispatch } from 'redux';
import {
    createCategoryRequest,
    createProductRequest,
    deleteProductRequest,
    fetchCategoryRequest,
    fetchProductsRequest,
    updateProductRequest,
} from '../../api/product-api';
import { IAction } from './productReducer';
import types from './productTypes';

export function setProducts(data: any): IAction {
    return {
        type: types.FETCH_PRODUCTS_SUCCESS,
        payload: data,
    };
}
export function setCategory(data: any): IAction {
    return {
        type: types.FETCH_CATEGORY_SUCCESS,
        payload: data,
    };
}

export const fetchProducts = (query: {
    textSearch?: string;
    page: number;
    limit: number;
    sort?: string;
}) => async (dispatch: Dispatch, getState: () => any) => {
    try {
        dispatch({
            type: types.FETCH_PRODUCTS_LOADING,
        });

        const { auth, store } = getState();
        const { token } = auth;
        const storeId = store.store._id;

        const res = await fetchProductsRequest({
            token: token.accessToken,
            storeId,
            query,
        });

        dispatch(setProducts(res));
    } catch (error) {
        dispatch({ type: types.FETCH_PRODUCTS_FAILED });
    }
};

export const createProduct = (data: any) => async (dispatch: Dispatch, getState: () => any) => {
    try {
        dispatch({
            type: types.CREATE_PRODUCT_LOADING,
        });

        const { auth, store } = getState();
        const { token } = auth;
        const storeId = store.store._id;

        const res = await createProductRequest({
            token: token.accessToken,
            storeId,
            data,
        });
        if (res) {
            message.success('Tạo mới sản phẩm thành công');
            return res;
        }
    } catch (error) {
        if (
            error &&
            error.response &&
            error.response.data &&
            error.response.data.message === 'PRODUCT_CODE_EXISTED'
        ) {
            message.error(`Mã sản phẩm ${data.code} đã tồn tại!`);
        }
        dispatch({ type: types.CREATE_PRODUCT_FAILED });
        return;
    }
};

export const updateProduct = (data: any) => async (dispatch: Dispatch, getState: () => any) => {
    try {
        const { auth, store } = getState();
        const { token } = auth;
        const storeId = store.store._id;

        const res = await updateProductRequest({
            token: token.accessToken,
            storeId,
            productId: data._id,
            data: { ...data, storeId },
        });
        if (res) {
            message.success('Chỉnh sửa sản phẩm thành công');
            return res;
        }
    } catch (error) {
        if (get(error, 'response.data.message') === 'PRODUCT_CODE_EXISTED') {
            message.error(`Mã sản phẩm ${data.code} đã tồn tại. Vui lòng nhập mã sản phẩm khác`);
        } else {
            message.error('Cập nhật sản phẩm thất bại');
        }
        dispatch({ type: types.UPDATE_PRODUCT_FAILED });
        return;
    }
};

export const deleteProduct = (productId: string) => async (
    dispatch: Dispatch,
    getState: () => any
) => {
    try {
        const { auth, store } = getState();
        const { token } = auth;
        const storeId = store.store._id;

        const res = await deleteProductRequest({
            token: token.accessToken,
            storeId,
            productId,
        });
        if (res) {
            message.success('Đã xoá 1 sản phẩm');
        }

        dispatch({ type: types.DELETE_PRODUCT_SUCCESS, payload: productId });
    } catch (error) {
        if (error && error.response && error.response.data && error.response.data.message) {
            message.error(`${error.response.data.message}`);
        } else {
            message.error('Lỗi xóa sản phẩm');
        }
        dispatch({ type: types.DELETE_PRODUCT_FAILED });
    }
};

export const fetchCategory = (textSearch?: string) => async (
    dispatch: Dispatch,
    getState: () => any
) => {
    try {
        const { auth, store } = getState();
        const { token } = auth;
        const storeId = store.store._id;

        const data = { token: token.accessToken, storeId, query: {} };
        textSearch && (data.query = { textSearch });

        const res = await fetchCategoryRequest(data);

        dispatch(setCategory(res));
    } catch (error) {
        dispatch({ type: types.FETCH_CATEGORY_FAILED });
    }
};

export const createCategory = (name: string) => async (dispatch: Dispatch, getState: () => any) => {
    try {
        const { auth, store } = getState();
        const { token } = auth;
        const storeId = store.store._id;

        const data = {
            token: token.accessToken,
            data: { name, storeId },
            storeId,
        };

        const res = await createCategoryRequest(data);
        if (res) {
            dispatch({
                type: types.SET_NEW_CATEGORY_SUCCESS,
                payload: res._id,
            });
            message.success('Tạo Danh mục thành công');
        }
    } catch (error) {
        message.error('Lỗi tạo Danh mục');
    }
};
