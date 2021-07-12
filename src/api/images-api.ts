import axios from './axios-client';

async function fetchImagesRequest({
    token,
    storeId,
    galleryId,
    star,
    name,
}: {
    token: string;
    storeId: string;
    galleryId?: string;
    star?: boolean;
    name?: string;
}): Promise<any> {
    const url = `/store/v1/stores/${storeId}/images`;

    const res = await axios({
        method: 'GET',
        url,
        params: {
            galleryId: galleryId || '',
            star: star ? 'true' : '',
            name: name || '',
        },
    });

    return res.data;
}

async function createImagesRequest({
    token,
    storeId,
    data,
}: {
    token: string;
    storeId: string;
    data: {
        galleryId?: string;
        name: string;
        key: string;
        star: boolean;
    };
}): Promise<any> {
    const url = `/store/v1/stores/${storeId}/images`;
    const res = await axios({
        method: 'POST',
        url,
        data,
    });

    return res.data;
}

async function likeImageRequest({
    token,
    storeId,
    imageId,
    star,
}: {
    token: string;
    storeId: string;
    imageId: string;
    star: boolean;
}): Promise<any> {
    const url = `/store/v1/stores/${storeId}/images/${imageId}/star`;

    const response = await axios({
        url,
        method: 'PUT',

        data: {
            star,
        },
    });
    return response.data;
}

async function removeImageRequest({
    storeId,
    imageId,
    token,
}: {
    storeId: string;
    imageId: string;

    token: string;
}): Promise<any> {
    const url = `/store/v1/stores/${storeId}/images/${imageId}`;

    const response = await axios({
        url,
        method: 'DELETE',
    });
    return response.data;
}

const updateImageRequest = async ({
    token,
    storeId,
    imageId,
    data,
}: {
    token: string;
    storeId: string;
    imageId: string;
    data: {
        star?: boolean;
        galleryId?: string;
        name?: string;
    };
}): Promise<any> => {
    const url = `/store/v1/stores/${storeId}/images/${imageId}`;
    const response = await axios({
        url,
        method: 'PUT',
        data,
    });

    return response.data;
};

export {
    fetchImagesRequest,
    createImagesRequest,
    removeImageRequest,
    likeImageRequest,
    updateImageRequest,
};
