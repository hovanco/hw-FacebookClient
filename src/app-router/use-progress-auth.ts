import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import authApi from '../api/auth-api';
import { getToken } from '../api/token';
import { getUserAction, logout } from '../reducers/authState/authAction';
import { IAuthState } from '../reducers/authState/authReducer';

export interface AuthState {
    auth: IAuthState;
}

export function useProgressAuth() {
    const dispatch = useDispatch();
    const isAuth = useSelector(({ auth }: AuthState) => auth.isAuth);
    const loading = useSelector(({ auth }: AuthState) => auth.loading);
    const [progress, setProgress] = useState<boolean>(true);

    useEffect(() => {
        async function processAuth() {
            try {
                if (window.location.pathname === '/save-token') {
                    return;
                }

                const refreshToken = getToken('refreshToken');

                if (!refreshToken) {
                    dispatch(logout());
                    return;
                }

                const response = await authApi.existingRefreshToken(refreshToken);

                if (!response.existingRefreshToken) {
                    dispatch(logout(false));
                    return;
                }

                dispatch(getUserAction());
            } catch (error) {
                dispatch(logout(false));
            } finally {
                setProgress(false);
            }
        }

        if (isAuth) {
            processAuth();
        } else {
            setProgress(false);
        }
    }, []);

    return useMemo(() => ({ loading, isAuth, progress }), [loading, isAuth, progress]);
}
