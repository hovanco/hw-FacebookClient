import { AxiosPromise } from 'axios';
import { SOCIAL_NETWORK_PATH, SOCIAL_NETWORK_VER } from '../configs/vars';
import { Payload } from '../reducers/setting/interfaces';
import axios from './axios-client';

export const loadQuickMessage = (payload: Payload): AxiosPromise => {
    const url = `${SOCIAL_NETWORK_PATH}/${SOCIAL_NETWORK_VER}/stores/${payload.storeId}/pages/${payload.pageId}/quick-answers`;
    return axios({
        url,
        method: 'GET',
    });
};

export const createQuickMessage = (payload: Payload): AxiosPromise => {
    const url = `${SOCIAL_NETWORK_PATH}/${SOCIAL_NETWORK_VER}/stores/${payload.storeId}/pages/${payload.pageId}/quick-answers`;

    return axios({
        url,
        method: 'POST',
        data: payload.data,
    });
};

export const updateQuickMessage = (payload: Payload): AxiosPromise => {
    const url = `${SOCIAL_NETWORK_PATH}/${SOCIAL_NETWORK_VER}/stores/${payload.storeId}/pages/${payload.pageId}/quick-answers/${payload.quickId}`;

    return axios({
        url,
        method: 'PUT',
        data: payload.data,
    });
};

export const deleteQuickMessage = (payload: Payload): AxiosPromise => {
    const url = `${SOCIAL_NETWORK_PATH}/${SOCIAL_NETWORK_VER}/stores/${payload.storeId}/pages/${payload.pageId}/quick-answers/${payload.quickId}`;

    return axios({
        url,
        method: 'DELETE',
    });
};

export const cloneQuickMessage = async ({
    storeId,
    pageId,
    data,
}: {
    storeId: string;
    pageId: string;
    data: {
        fbPageId: string;
        replace?: boolean;
        copyAll?: boolean;
        quickAnswerIds?: string[];
    };
}): Promise<any> => {
    const url = `${SOCIAL_NETWORK_PATH}/${SOCIAL_NETWORK_VER}/stores/${storeId}/pages/${pageId}/quick-answers/clone`;
    const response = await axios({
        url,
        method: 'POST',
        data,
    });

    return response.data;
};

// get list label of page

export const getListLabels = async ({
    storeId,
    pageId,
    limit = 10,
}: {
    storeId: string;
    pageId: string;
    limit?: number;
}): Promise<any> => {
    const url = `${SOCIAL_NETWORK_PATH}/${SOCIAL_NETWORK_VER}/stores/${storeId}/pages/${pageId}/labels?limit=${limit}`;
    const response = await axios({
        method: 'GET',
        url,
    });
    return response.data;
};

// add label
export async function addLabel({
    storeId,
    pageId,
    data,
}: {
    storeId: string;
    pageId: string;
    data: any;
}): Promise<any> {
    const url = `${SOCIAL_NETWORK_PATH}/${SOCIAL_NETWORK_VER}/stores/${storeId}/pages/${pageId}/labels`;

    const response = await axios({
        method: 'POST',
        url,
        data,
    });

    return response.data;
}

// remove label
export async function removeLabel({
    storeId,
    pageId,
    labelId,
}: {
    storeId: string;
    pageId: string;
    labelId: string;
}): Promise<any> {
    const url = `${SOCIAL_NETWORK_PATH}/${SOCIAL_NETWORK_VER}/stores/${storeId}/pages/${pageId}/labels/${labelId}`;

    const response = await axios({
        method: 'DELETE',
        url,
    });
    return response.data;
}

// update label
export async function updateLabel({
    storeId,
    pageId,
    data,
    labelId,
}: {
    storeId: string;
    pageId: string;
    data: any;
    labelId: string;
}): Promise<any> {
    const url = `${SOCIAL_NETWORK_PATH}/${SOCIAL_NETWORK_VER}/stores/${storeId}/pages/${pageId}/labels/${labelId}`;

    const response = await axios({
        method: 'PUT',
        url,
        data,
    });
    return response.data;
}

// clone labels
export async function cloneLabels({
    storeId,
    pageId,
    data,
}: {
    storeId: string;
    pageId: string;
    data: {
        fbPageId: string;
        replace?: boolean;
        copyAll?: boolean;
        labelIds?: string[];
    };
}): Promise<any> {
    const url = `${SOCIAL_NETWORK_PATH}/${SOCIAL_NETWORK_VER}/stores/${storeId}/pages/${pageId}/labels/clone`;

    const response = await axios({
        method: 'POST',
        url,
        data,
    });
    return response.data;
}

export const getFacebookPageSetting = async ({
    storeId,
    fbPageId,
    token,
}: {
    storeId: string;
    fbPageId: string;
    token: string;
}): Promise<any> => {
    const url = `${SOCIAL_NETWORK_PATH}/${SOCIAL_NETWORK_VER}/stores/${storeId}/facebook-pages/${fbPageId}/settings`;
    const response = await axios({
        method: 'GET',
        url,
    });
    return response.data;
};

export const updateFacebookPageSetting = async ({
    storeId,
    fbPageId,
    token,
    data,
}: {
    storeId: string;
    fbPageId: string;
    token: string;
    data: { hideAllComments: boolean; hidePhoneComments: boolean };
}): Promise<any> => {
    const url = `${SOCIAL_NETWORK_PATH}/${SOCIAL_NETWORK_VER}/stores/${storeId}/facebook-pages/${fbPageId}/settings`;

    const response = await axios({
        method: 'PUT',
        url,
        data,
    });
    return response.data;
};
