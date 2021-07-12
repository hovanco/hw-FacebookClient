import axios from './axios-client';

async function fetchWarehousesRequest({
    token,
    storeId,
    query,
}: {
    token: string;
    storeId: string;
    query: { page: number; limit: number };
}): Promise<any> {
    const { page, limit } = query;
    let url = `/store/v1/stores/${storeId}/warehouses?page=${page}&limit=${limit}`;

    const res = await axios({
        method: 'GET',
        url: url,
    });

    return res.data;
}

async function createWarehouseRequest({
    token,
    storeId,
    data,
}: {
    token: string;
    storeId: string;
    data: any;
}): Promise<any> {
    const res = await axios({
        method: 'POST',
        url: `/store/v1/stores/${storeId}/warehouses`,

        data,
    });

    return res.data;
}

async function updateWarehouseRequest({
    token,
    warehouseId,
    data,
}: {
    token: string;
    storeId: string;
    warehouseId: string;
    data: any;
}): Promise<any> {
    const { __v, _id, createdAt, updatedAt, storeId, ...rest } = data;
    const res = await axios({
        method: 'PUT',
        url: `/store/v1/stores/${storeId}/warehouses/${warehouseId}`,

        data: rest,
    });

    return res.data;
}

async function deleteWarehouseRequest({
    token,
    storeId,
    warehouseId,
}: {
    token: string;
    storeId: string;
    warehouseId: string;
}): Promise<any> {
    const res = await axios({
        method: 'DELETE',
        url: `/store/v1/stores/${storeId}/warehouses/${warehouseId}`,
    });

    return res.data;
}

export {
    fetchWarehousesRequest,
    createWarehouseRequest,
    deleteWarehouseRequest,
    updateWarehouseRequest,
};
