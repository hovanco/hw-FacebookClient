import axios from './axios-client';

const servicesTransport = async ({
    storeId,
    token,
    data,
}: {
    storeId: string;
    token: string;
    data: {
        toProvinceId?: string;
        toWardId?: string;
        toDistrictId?: string;
        warehouseId?: string;
        weight: number;
        length?: number;
        width?: number;
        height?: number;
    };
}): Promise<any> => {
    const url = `/store/v1/stores/${storeId}/transports/services`;

    const response = await axios({
        url,
        method: 'POST',
        data,
    });

    return response.data;
};

const loadShipping = async ({
    storeId,
    token,
    data,
}: {
    storeId: string;
    token: string;
    data: {
        toProvinceId?: any;
        toWardId?: any;
        toDistrictId?: any;

        weight: number;
        length?: number;
        width?: number;
        height?: number;
    };
}) => {
    const url = `/store/v1/stores/${storeId}/calculate-shipment-fee`;
    const response = await axios({
        method: 'POST',
        url,
        data,
    });
    return response.data;
};

const toggleCreateOrderShip = async ({
    storeId,
    orderId,
    token,
    cancel,
    warehouseId,
}: {
    storeId: string;
    orderId: string;
    token: string;
    cancel?: boolean;
    warehouseId: string;
}): Promise<any> => {
    const base_url = `/store/v1/stores/${storeId}/orders/${orderId}`;
    const endpoint = cancel ? '/cancel' : '/transports';
    const method = cancel ? 'PUT' : 'POST';

    const response = await axios({
        method,
        url: `${base_url}${endpoint}`,
        data: {
            warehouseId,
        },
    });

    return response.data;
};

const shippingApi = {
    loadShipping,
    servicesTransport,
    toggleCreateOrderShip,
};

export default shippingApi;
