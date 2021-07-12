import axios from './axios-client';

const staffApi = {
    listStaff: async ({ storeId, token }: { storeId: string; token: string }): Promise<any> => {
        const url = `/store/v1/stores/${storeId}/staffs`;

        const reponse = await axios({
            url,
            method: 'GET',
        });

        return reponse.data;
    },
    createStaff: async ({
        storeId,
        data,
        token,
    }: {
        storeId: string;
        token: string;
        data: {
            email: string;
            password: string;
            role: number;
            name: string;
        };
    }): Promise<any> => {
        const url = `/store/v1/stores/${storeId}/staffs`;
        const response = await axios({
            url,
            method: 'POST',
            data,
        });

        return response.data;
    },

    updateStaff: async ({
        storeId,
        staffId,
        data,
        token,
    }: {
        storeId: string;
        staffId: string;
        data: {
            role: number;
            name?: string;
        };
        token: string;
    }): Promise<any> => {
        const url = `/store/v1/stores/${storeId}/staffs/${staffId}`;
        const response = await axios({
            url,
            method: 'PUT',
            data,
        });

        return response.data;
    },

    deleteStaff: async ({
        storeId,
        staffId,
        token,
    }: {
        storeId: string;
        staffId: string;
        token: string;
    }): Promise<any> => {
        const url = `/store/v1/stores/${storeId}/staffs/${staffId}`;
        const response = await axios({
            url,
            method: 'DELETE',
        });

        return response.data;
    },
};

export default staffApi;
