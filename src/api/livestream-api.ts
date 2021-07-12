import axiosClient from './axios-client';

const livestreamApi = {
    createLivestream: async ({
        storeId,
        fbPageId,
        data,
    }: {
        storeId: string;
        fbPageId: string;
        data: any;
    }): Promise<any> => {
        const url = `/social-network/v1/stores/${storeId}/facebook-pages/${fbPageId}/livestream-scripts`;
        const response = await axiosClient({
            url,
            method: 'POST',
            data,
        });

        return response.data;
    },

    copyLivestream: async ({
        storeId,
        fbPageId,
        data,
    }: {
        storeId: string;
        fbPageId: string;
        data: { scriptId: string; name: string };
    }): Promise<any> => {
        const url = `/social-network/v1/stores/${storeId}/facebook-pages/${fbPageId}/livestream-scripts/copy`;

        const response = await axiosClient({
            url,
            method: 'POST',
            data,
        });

        return response.data;
    },

    checkEmptyLivestream: async (storeId: string): Promise<any> => {
        const url = `/social-network/v1/stores/${storeId}/livestream-scripts/check-empty`;

        const response = await axiosClient({
            url,
            method: 'GET',
        });

        return response.data;
    },

    loadLiveStream: async ({
        storeId,
        fbPageId,
        page = 1,
        limit = 15,
        name = undefined,
        startTime = undefined,
        endTime = undefined,
        sort = undefined,
        direction = undefined,
        status = undefined,
        active = undefined,
    }: {
        storeId: string;
        fbPageId: string;
        page?: number;
        limit?: number;
        name?: string;
        startTime?: number;
        endTime?: number;
        sort?: string;
        direction?: string;
        status?: number;
        active?: boolean;
    }): Promise<any> => {
        const url = `/social-network/v1/stores/${storeId}/facebook-pages/${fbPageId}/livestream-scripts`;

        const response = await axiosClient({
            method: 'GET',
            url,
            params: {
                page,
                limit,
                name,
                startTime,
                endTime,
                sort,
                direction,
                status,
                active,
            },
        });

        return response.data;
    },

    loadScript: async ({
        storeId,
        fbPageId,
        scriptId,
    }: {
        storeId: string;
        fbPageId: string;
        scriptId: string;
    }): Promise<any> => {
        const url = `/social-network/v1/stores/${storeId}/facebook-pages/${fbPageId}/livestream-scripts/${scriptId}`;

        const response = await axiosClient({
            method: 'GET',
            url,
        });

        return response.data;
    },

    deleteScript: async ({
        storeId,
        fbPageId,
        scriptId,
    }: {
        storeId: string;
        fbPageId: string;
        scriptId: string;
    }): Promise<any> => {
        const url = `/social-network/v1/stores/${storeId}/facebook-pages/${fbPageId}/livestream-scripts/${scriptId}`;

        const response = await axiosClient({
            method: 'DELETE',
            url,
        });

        return response.data;
    },

    updateScript: async ({
        storeId,
        fbPageId,
        scriptId,
        data,
    }: {
        storeId: string;
        fbPageId: string;
        scriptId: string;
        data: any;
    }): Promise<any> => {
        const url = `/social-network/v1/stores/${storeId}/facebook-pages/${fbPageId}/livestream-scripts/${scriptId}`;

        const response = await axiosClient({
            method: 'PUT',
            url,
            data,
        });

        return response.data;
    },

    changeActiveScript: async ({
        storeId,
        fbPageId,
        scriptId,
        active,
    }: {
        storeId: string;
        fbPageId: string;
        scriptId: string;
        active: boolean;
    }): Promise<any> => {
        const url = `/social-network/v1/stores/${storeId}/facebook-pages/${fbPageId}/livestream-scripts/${scriptId}/active`;

        const response = await axiosClient({
            url,
            method: 'PUT',
            data: {
                active,
            },
        });

        return response.data;
    },

    getVideos: async ({
        storeId,
        fbPageId,
    }: {
        storeId: string;
        fbPageId: string;
    }): Promise<any> => {
        const url = `/social-network/v1/stores/${storeId}/facebook-pages/${fbPageId}/videos?limit=50`;

        const response = await axiosClient({
            method: 'GET',
            url,
        });

        return response.data;
    },
    getVideo: async ({
        storeId,
        fbPageId,
        videoId,
    }: {
        storeId: string;
        fbPageId: string;
        videoId: string;
    }): Promise<any> => {
        const url = `/social-network/v1/stores/${storeId}/facebook-pages/${fbPageId}/videos/${videoId}`;

        const response = await axiosClient({
            method: 'GET',
            url,
        });

        return response.data;
    },

    getCustomerInLivestream: async ({
        storeId,
        fbPageId,
        scriptId,
        page,
        limit,
        isHasPhoneNo,
        isHasOrder,
        search,
    }: {
        storeId: string;
        fbPageId: string;
        scriptId: string;
        page?: number;
        limit?: number;
        isHasPhoneNo?: boolean;
        isHasOrder?: boolean;
        search?: string;
    }): Promise<any> => {
        const url = `/social-network/v1/stores/${storeId}/pages/${fbPageId}/livestream-scripts/${scriptId}/reports/customers`;

        const response = await axiosClient({
            method: 'GET',
            url,
            params: {
                page,
                limit,
                isHasPhoneNo,
                isHasOrder,
                search,
            },
        });
        return response.data;
    },

    updateOrderIdInComment: async ({
        storeId,
        fbPageId,
        scriptId,
        data,
    }: {
        storeId: string;
        fbPageId: string;
        scriptId: string;
        data: {
            fbUserId: string;
            orderId: string;
        };
    }): Promise<any> => {
        const url = `/social-network/v1/stores/${storeId}/pages/${fbPageId}/livestream-scripts/${scriptId}/comments`;

        const response = await axiosClient({
            url,
            method: 'PUT',
            data,
        });

        return response.data;
    },

    checkActiveAndNotUseScripts: async ({
        storeId,
        fbPageId,
    }: {
        storeId: string;
        fbPageId: string;
    }): Promise<boolean> => {
        const url = `/social-network/v1/stores/${storeId}/facebook-pages/${fbPageId}/livestream-scripts/check-incoming-scripts`;

        const response = await axiosClient({
            method: 'GET',
            url,
        });
        return response.data && response.data.result;
    },
};

export default livestreamApi;
