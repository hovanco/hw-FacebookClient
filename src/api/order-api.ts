import axios from './axios-client';
import { omit } from 'lodash';

async function fetchOrdersRequest({
    token,
    storeId,
    query,
}: {
    token: string;
    storeId: string;
    query: { status?: string; page: number; limit: number; draft?: boolean };
}): Promise<any> {
    let url = `/store/v1/stores/${storeId}/orders`;

    const res = await axios({
        method: 'GET',
        url: url,

        params: query,
    });

    return res.data;
}

async function updateStatusOrdersRequest({
    token,
    storeId,
    orderId,
    data,
}: {
    token: string;
    storeId: string;
    orderId: string;
    data: { status: string };
}): Promise<any> {
    let url = `/store/v1/stores/${storeId}/orders/${orderId}`;

    const res = await axios({
        method: 'PUT',
        url: url,

        data,
    });

    return res.data;
}

async function removeOrdersRequest({
    token,
    storeId,
    orderId,
}: {
    token: string;
    storeId: string;
    orderId: string;
}): Promise<any> {
    let url = `/store/v1/stores/${storeId}/orders/${orderId}`;

    await axios({
        method: 'DELETE',
        url: url,
    });
}

async function getOrderDetail({
    token,
    storeId,
    orderId,
}: {
    token: string;
    storeId: string;
    orderId: string;
}): Promise<any> {
    const url = `/store/v1/stores/${storeId}/orders/${orderId}`;
    const response = await axios({
        method: 'GET',
        url,
    });

    return response.data;
}

async function updateOrder({
    token,
    storeId,
    orderId,
    data,
}: {
    token: string;
    storeId: string;
    orderId: string;
    data: any;
}): Promise<any> {
    let url = `/store/v1/stores/${storeId}/orders/${orderId}`;

    const res = await axios({
        method: 'PUT',
        url: url,

        data: omit(data, ['source']),
    });

    return res.data;
}

export {
    fetchOrdersRequest,
    updateStatusOrdersRequest,
    removeOrdersRequest,
    getOrderDetail,
    updateOrder,
};
