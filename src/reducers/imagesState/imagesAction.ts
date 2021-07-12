import { Dispatch } from 'redux';
import { message } from 'antd';

import types from './imagesTypes';

import { fetchImagesRequest } from '../../api/images-api';
import { createGalleryRequest, fetchGalleryRequest } from '../../api/gallery-api';

export const addImages = (images: string[]) => {
    return {
        type: types.ADD_IMAGES_SUCCESS,
        payload: images,
    };
};

export const removeImage = (imageId: string) => {
    return {
        type: types.DELETE_IMAGE,
        payload: imageId,
    };
};

export const changTextSearch = (text: string) => {
    return {
        type: types.SEARCH,
        payload: text,
    };
};

export const searchImage = ({
    text,
    galleryId,
}: {
    text: string;
    galleryId?: string;
    star?: boolean;
}) => async (dispatch: Dispatch, getState: () => any) => {
    dispatch({
        type: types.FETCH_IMAGES_LOADING,
    });

    try {
        const { auth, store } = getState();
        const { token } = auth;
        const storeId = store.store._id;

        const res = await fetchImagesRequest({
            token: token.accessToken,
            storeId,
            galleryId,
            name: text,
        });

        if (res) {
            dispatch({ type: types.FETCH_IMAGES_SUCCESS, payload: res });
        }
    } catch (error) {
        dispatch({ type: types.FETCH_IMAGES_FAILED });
    }
};

export const toggleBookmark = (imageId: string) => {
    return {
        type: types.TOOGLE_LIKE_IMAGE,
        payload: imageId,
    };
};

export const fetchImages = (galleryId?: string) => async (
    dispatch: Dispatch,
    getState: () => any
) => {
    try {
        dispatch({
            type: types.FETCH_IMAGES_LOADING,
        });

        const { auth, store } = getState();
        const { token } = auth;
        const storeId = store.store._id;

        const res = await fetchImagesRequest({
            token: token.accessToken,
            storeId,
            galleryId,
        });

        if (res) {
            dispatch({ type: types.FETCH_IMAGES_SUCCESS, payload: res });
        }
    } catch (error) {
        dispatch({ type: types.FETCH_IMAGES_FAILED });
    }
};

export const fetchImagesBookmark = () => async (dispatch: Dispatch, getState: any) => {
    dispatch({
        type: types.FETCH_IMAGES_LOADING,
    });

    try {
        const { auth, store } = getState();
        const { token } = auth;
        const storeId = store.store._id;

        const res = await fetchImagesRequest({
            token: token.accessToken,
            storeId,
            star: true,
        });

        dispatch({ type: types.FETCH_IMAGES_SUCCESS, payload: res });
    } catch (error) {}
};

export const createGallery = (name: string) => async (dispatch: Dispatch, getState: () => any) => {
    try {
        const { auth, store } = getState();
        const { token } = auth;
        const storeId = store.store._id;

        const res = await createGalleryRequest({
            token: token.accessToken,
            storeId,
            data: { name },
        });

        if (res) {
            dispatch({ type: types.CREATE_GALLERY_SUCCESS, payload: res });
        }
    } catch (error) {
        message.error('Lỗi tạo mới danh mục');
    }
};

export const fetchGallery = () => async (dispatch: Dispatch, getState: () => any) => {
    try {
        const { auth, store } = getState();
        const { token } = auth;
        const storeId = store.store._id;

        const res = await fetchGalleryRequest({
            token: token.accessToken,
            storeId,
        });

        if (res) {
            dispatch({ type: types.FETCH_GALLERY_SUCCESS, payload: res });
        }
    } catch (error) {
        dispatch({ type: types.FETCH_IMAGES_FAILED });
    }
};

export function deleteGallery(galleryId: string) {
    return {
        type: types.DELETE_GALLERY,
        payload: galleryId,
    };
}
