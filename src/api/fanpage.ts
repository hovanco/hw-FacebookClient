import { AxiosPromise } from 'axios';
import axios from './axios-client';

export interface Payload {
    shortLiveToken: string;
}

export const connectFanpageApi = async ({
    payload,
    storeId,
    token,
}: {
    payload: any;
    storeId: string;
    token: string;
}): Promise<any> => {
    const url = `/social-network/v1/stores/${storeId}/facebook-pages/link`;

    return axios({
        url,
        method: 'POST',
        data: payload,
    });
};

export const loadFanpages = (storeId: string): AxiosPromise => {
    const url = `/social-network/v1/stores/${storeId}/facebook-pages`;

    return axios({
        url,
        method: 'GET',
    });
};

export const updateActiveFanpages = async ({
    payload,
    storeId,
    token,
}: {
    payload: { activeFbPageIds: string[]; inactiveFbPageIds: string[] };
    storeId: string;
    token: string;
}): Promise<any> => {
    const url = `/social-network/v1/stores/${storeId}/facebook-pages`;

    return axios({
        url,
        method: 'PUT',
        data: payload,
    });
};

export const updatePageStatus = async ({
    fbPageId,
    payload,
    storeId,
    token,
}: {
    fbPageId: string;
    payload: { active: boolean };
    storeId: string;
    token: string;
}): Promise<any> => {
    const url = `/social-network/v1/stores/${storeId}/facebook-pages/${fbPageId}/active`;

    return axios({
        url,
        method: 'PUT',
        data: payload,
    });
};

export const validateToken = async ({
    storeId,
    fbPageId,
    token,
}: {
    storeId: string;
    fbPageId: string;
    token: string;
}): Promise<any> => {
    const url = `/social-network/v1/stores/${storeId}/facebook-pages/${fbPageId}/validate-token`;

    return axios({
        url,
        method: 'GET',
    });
};
