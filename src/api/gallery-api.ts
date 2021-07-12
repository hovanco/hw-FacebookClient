import axiosClient from './axios-client';

async function fetchGalleryRequest({
    token,
    storeId,
}: {
    token: string;
    storeId: string;
}): Promise<any> {
    const url = `/store/v1/stores/${storeId}/galleries`;

    const response = await axiosClient({
        method: 'GET',
        url,
    });

    return response.data;
}

async function createGalleryRequest({
    token,
    storeId,
    data,
}: {
    token: string;
    storeId: string;
    data: { name: string };
}): Promise<any> {
    const url = `/store/v1/stores/${storeId}/galleries`;

    const response = await axiosClient({
        method: 'POST',
        url,

        data,
    });

    return response.data;
}

async function deleteGallery({
    storeId,
    galleryId,
    token,
}: {
    token: string;
    storeId: string;
    galleryId: string;
}) {
    const url = `/store/v1/stores/${storeId}/galleries/${galleryId}`;

    const response = await axiosClient({
        method: 'DELETE',
        url,
    });
    return response.data;
}

export { fetchGalleryRequest, createGalleryRequest, deleteGallery };
