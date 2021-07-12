import { SOCIAL_NETWORK_PATH, SOCIAL_NETWORK_VER } from '../configs/vars';
import axiosClient from './axios-client';

const labelApi = {
    getListLabels: async ({
        storeId,
        pageId,
        limit = 10,
    }: {
        storeId: string;
        pageId: string;
        limit?: number;
    }) => {
        const url = `${SOCIAL_NETWORK_PATH}/${SOCIAL_NETWORK_VER}/stores/${storeId}/pages/${pageId}/labels?limit=${limit}`;
        const response = await axiosClient({
            method: 'GET',
            url,
        });

        return response.data;
    },
};

export default labelApi;
