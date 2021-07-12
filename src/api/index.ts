import { AxiosPromise } from 'axios';
import axios from './axios-client';

export interface Payload {
    email?: string;
    password?: string;
    accessToken?: string;
}

export const loginApi = (payload: Payload, service?: string): AxiosPromise => {
    const url = service ? `/authentication/v1/signin/${service}` : '/authentication/v1/signin';

    return axios({
        url,
        method: 'POST',
        data: payload,
    });
};
