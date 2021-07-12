import Axios from './axios-client';
import constant_url from './constant_url';

const reportApi = {
    // report conversation
    reportConversation: async ({
        storeId,
        pageId,
        startTime,
        endTime,
        token,
    }: {
        storeId: string;
        pageId: string;
        startTime: number;
        endTime: number;
        token: string;
    }): Promise<any> => {
        const url = `${constant_url.SOCIAL_NETWORK_BASE}/stores/${storeId}/pages/${pageId}/reports/conversations?startTime=${startTime}&endTime=${endTime}`;

        const response = await Axios({
            method: 'GET',
            url,
        });

        return response.data;
    },

    // report label
    reportLabel: async ({
        storeId,
        pageId,
        startTime,
        endTime,
    }: {
        storeId: string;
        pageId: string;
        startTime: number;
        endTime: number;
    }): Promise<any> => {
        const url = `${constant_url.SOCIAL_NETWORK_BASE}/stores/${storeId}/pages/${pageId}/reports/labels?startTime=${startTime}&endTime=${endTime}`;

        const response = await Axios({
            method: 'GET',
            url,
        });

        return response.data;
    },
    // report revenue
    reporRevenue: async ({
        storeId,
        pageId,
        startTime,
        endTime,
        createdBy,
    }: {
        storeId: string;
        pageId: string;
        startTime: number;
        endTime: number;
        createdBy?: string;
    }): Promise<any> => {
        const queryString = createdBy
            ? `startTime=${startTime}&endTime=${endTime}&createdBy=${createdBy};`
            : `startTime=${startTime}&endTime=${endTime}`;
        const url = `${constant_url.SOCIAL_NETWORK_BASE}/stores/${storeId}/pages/${pageId}/reports/revenue?${queryString}`;

        const response = await Axios({
            method: 'GET',
            url,
        });

        return response.data;
    },
};

export default reportApi;
