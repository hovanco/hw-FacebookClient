import * as queryString from 'query-string';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Loading } from '../../components';
import constants from '../../constants';
import { AuthLayout } from '../../layout';

const title = 'Đăng nhập';

function Login(): JSX.Element {
    const location = useLocation();
    const isLogout = useSelector(({ auth }: any) => auth.isLogout);

    useEffect(() => {
        const lastState: any = location.state;
        let lastLocation = lastState?.from;
        if (!lastLocation?.pathname) {
            lastLocation = {
                pathname: '/',
            };
        }
        const search = queryString.stringify({
            url: `${window.location.origin}/save-token`,
            location: JSON.stringify(lastLocation),
            isLogout,
            guest: lastState?.guest,
            saleChannel: 'facebook',
        });

        window.location.href = `${constants.URL_AUTH}login?${search}`;
    }, []);

    return (
        <AuthLayout title={title}>
            <Loading full />
        </AuthLayout>
    );
}

export default Login;
