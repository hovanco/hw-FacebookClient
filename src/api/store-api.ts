import { omit } from 'lodash';
import { ESaleChannel } from '../collections/sale-channel';
import axiosClient from './axios-client';

async function createStore({
    token,
    name,
    address,
    province,
    district,
    ward,
    phoneNo,
}: {
    token: string;
    name: string;
    address: string;
    province: string;
    district: string;
    ward: string;
    phoneNo: string;
}): Promise<any> {
    const res = await axiosClient({
        method: 'POST',
        url: '/store/v1/stores',
        data: { name, address, province, district, ward, phoneNo },
    });

    return res.data;
}

async function loadStore(token: string): Promise<any> {
    const res = await axiosClient({
        method: 'GET',
        url: '/store/v1/stores',
    });

    return res.data;
}

async function editStore({
    token,
    storeId,
    data,
}: {
    token: string;
    storeId: string;
    data: { name?: string, saleChannels?: ESaleChannel[], };
}): Promise<any> {
    const res = await axiosClient({
        method: 'PUT',
        url: `/store/v1/stores/${storeId}`,

        data,
    });

    return res.data;
}

async function getListCustomers({
    storeId,
    token,
    page = 1,
    limit = 10,
    query,
}: {
    storeId: string;
    token: string;
    page?: number;
    limit?: number;
    query?: string;
}) {
    const url = `/store/v1/stores/${storeId}/customers?page=${page}&limit=${limit}&${query}`;
    const response = await axiosClient({
        method: 'GET',
        url,
    });

    return response.data;
}

async function createCustomer({
    storeId,
    token,
    data,
}: {
    storeId: string;
    token: string;
    data: any;
}) {
    const url = `/store/v1/stores/${storeId}/customers`;
    const response = await axiosClient({
        method: 'POST',
        url,
        data: { ...data, source: 'facebook' },
    });

    return response.data;
}

async function updateCustomer({
    storeId,
    token,
    customerId,
    data,
}: {
    storeId: string;
    token: string;
    customerId: string;
    data: any;
}) {
    const url = `/store/v1/stores/${storeId}/customers/${customerId}`;
    const response = await axiosClient({
        method: 'PUT',
        url,
        data: omit(data, ['source']),
    });

    return response.data;
}

interface IProduct {
    productId: string;
    count: number;
}

interface ICustomer {
    name: string;
    phoneNo: string;
    address: string;
}

async function createOrder({
    storeId,
    token,
    data,
}: {
    storeId: string;
    token: string;
    data: {
        fbPageId?: string;
        products: IProduct[];
        customer: ICustomer;
        deliveryOptions: any;
        warehouseId?: string;
    };
}): Promise<any> {
    const res = await axiosClient({
        method: 'POST',
        url: `/store/v1/stores/${storeId}/orders`,
        data: { ...data, source: 'facebook' },
    });

    return res.data;
}

const storeApi = {
    loadStore,
    createStore,
    editStore,
    getListCustomers,
    createCustomer,
    createOrder,
    updateCustomer,
};

export default storeApi;
