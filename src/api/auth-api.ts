import axios from './axios-client';
import Axios from 'axios';
import constants from '../constants';

interface FormAuthDate {
    email?: string;
    password?: string;
}

interface LoginService {
    service: 'facebook' | 'google';
    accessToken: string;
}

export async function loginWithEmail(data: FormAuthDate): Promise<void> {
    const response = await axios({
        method: 'POST',
        url: '/authentication/v1/signin',
        data,
    });

    return response.data;
}

export async function signupWithEmail(data: FormAuthDate): Promise<void> {
    const response = await axios({
        method: 'POST',
        url: '/authentication/v1/signup',
        data,
    });

    return response.data;
}

export async function loginWithService({ accessToken, service }: LoginService): Promise<void> {
    const url = `/authentication/v1/signin/${service}`;

    const data = { accessToken };

    const response = await axios({
        method: 'POST',
        url,
        data,
    });

    return response.data;
}

export async function getUser(): Promise<void> {
    const url = '/authentication/v1/users/info';

    const response = await axios({
        url,
        method: 'GET',
    });

    return response.data;
}

export async function refreshAccessToken(refreshToken: string): Promise<any> {
    const response = await Axios({
        method: 'POST',
        url: `${constants.URL_API}/authentication/v1/auth/refresh-token`,
        data: {
            refreshToken,
        },
    });

    return response.data;
}

export async function existingRefreshToken(refreshToken: string): Promise<any> {
    const response = await axios({
        method: 'POST',
        url: '/authentication/v1/auth/existing-refresh-token',
        data: {
            refreshToken,
        },
    });

    return response.data
}

export async function logout(refreshToken: string): Promise<any> {
    const response = await axios({
        method: 'POST',
        url: '/authentication/v1/auth/logout',
        data: {
            refreshToken,
        },
    });

    return response.data;
}

const authApi = {
    loginWithEmail,
    signupWithEmail,
    loginWithService,
    getUser,
    refreshAccessToken,
    existingRefreshToken,
    logout,
};

export default authApi;
