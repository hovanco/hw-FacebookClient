import axios from './axios-client';

async function fetchProductsRequest({
    token,
    storeId,
    query,
}: {
    token: string;
    storeId: string;
    query: {
        textSearch?: string;
        page: number;
        limit: number;
        sort?: string,
        withQuantity?: boolean,
        warehouseId?: string,
    };
}): Promise<any> {
    const { page, limit, textSearch, sort, withQuantity, warehouseId } = query;
    let url = `/store/v1/stores/${storeId}/products?page=${page}&limit=${limit}&variant=true&createdAt=desc`;
    textSearch && (url += `&search=${textSearch}`);
    sort && (url += `&${sort}`);
    warehouseId && (url += `&warehouseId=${warehouseId}`);
    withQuantity && (url += `&withQuantity=${withQuantity}`);

    const res = await axios({
        method: 'GET',
        url: url,
    });

    return res.data;
}

async function createProductRequest({
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
        url: `/store/v1/stores/${storeId}/products`,

        data,
    });

    return res.data;
}

async function updateProductRequest({
    token,
    productId,
    data,
}: {
    token: string;
    storeId: string;
    productId: string;
    data: any;
}): Promise<any> {
    const { __v, _id, createdAt, updatedAt, storeId, key, ...rest } = data;
    const res = await axios({
        method: 'PUT',
        url: `/store/v1/stores/${storeId}/products/${productId}`,

        data: rest,
    });

    return res.data;
}

async function deleteProductRequest({
    token,
    storeId,
    productId,
}: {
    token: string;
    storeId: string;
    productId: string;
}): Promise<any> {
    const res = await axios({
        method: 'DELETE',
        url: `/store/v1/stores/${storeId}/products/${productId}`,
    });

    return res.data;
}

async function fetchCategoryRequest({
    token,
    storeId,
    query,
}: {
    token: string;
    storeId: string;
    query?: { textSearch?: string };
}): Promise<any> {
    const { textSearch } = query || {};
    let url = `/store/v1/stores/${storeId}/categories?page=1&limit=20`;
    textSearch && (url += `&search=${textSearch}`);

    const res = await axios({
        method: 'GET',
        url: url,
    });

    return res.data;
}

async function createCategoryRequest({
    token,
    data,
    storeId,
}: {
    token: string;
    storeId: string;
    data: { name: string; parentId?: string };
}): Promise<any> {
    let url = `/store/v1/stores/${storeId}/categories`;

    const res = await axios({
        method: 'POST',
        url: url,

        data,
    });

    return res.data;
}

export {
    fetchProductsRequest,
    createProductRequest,
    deleteProductRequest,
    fetchCategoryRequest,
    createCategoryRequest,
    updateProductRequest,
};
