import { AxiosPromise } from 'axios';
import axios from './axios-client';

export const getUserApi = (): AxiosPromise => {
    const url = '/authentication/v1/users/info';

    return axios({
        url,
        method: 'GET',
    });
};
