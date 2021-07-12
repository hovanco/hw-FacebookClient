import React, { FC, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, RouteProps } from 'react-router-dom';

import { IAuthState } from '../reducers/authState/authReducer';
import { IStoreState } from '../reducers/storeState/storeReducer';
import { Loading } from '../components';

interface Props {
    children: ReactNode;
}

const GuestRouter: FC<Props & RouteProps> = ({ children, ...rest }): JSX.Element => {
    const isAuth = useSelector(({ auth }: { auth: IAuthState }) => auth.isAuth);

    return (
        <Route
            {...rest}
            render={({ location }) =>
                !isAuth ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: '/customer',
                            state: { from: location },
                        }}
                    />
                )
            }
        />
    );
};

const UserRouter: FC<Props & RouteProps> = ({ children, ...rest }): JSX.Element => {
    const isAuth = useSelector(({ auth }: { auth: IAuthState }) => auth.isAuth);

    return (
        <Route
            {...rest}
            render={({ location }) =>
                isAuth ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: { from: location },
                        }}
                    />
                )
            }
        />
    );
};

const CustomerRouter: FC<Props & RouteProps> = ({ children, ...rest }): JSX.Element => {
    const isAuth = useSelector(({ auth }: { auth: IAuthState }) => auth.isAuth);

    const loadingStore = useSelector(({ store }: { store: IStoreState }) => store.loading);

    const store = useSelector(({ store }: { store: IStoreState }) => store.store);

    const notAllowRedirects = [
        '/customer/report/conversation',
        '/customer/report/label',
        '/customer/report/revenue',
        '/customer/other/members',
        '/customer/other/customer',
        '/customer/other/setting',
        '/customer/select-pages',
    ];

    if (loadingStore && isAuth) return <Loading full />;

    return (
        <Route
            {...rest}
            render={({ location }) => {
                if (!isAuth) {
                    return (
                        <Redirect
                            to={{
                                pathname: '/login',
                                state: { from: location },
                            }}
                        />
                    );
                }

                if (isAuth && !store)
                    return (
                        <Redirect
                            to={{
                                pathname: '/create-store',
                                state: { from: location },
                            }}
                        />
                    );

                if (isAuth && store) {
                    if (
                        (store.role >= 2 && notAllowRedirects.includes(location.pathname)) ||
                        (store.role === 1 && location.pathname === '/customer/select-pages')
                    ) {
                        return (
                            <Redirect
                                to={{
                                    pathname: '/customer/conversation',
                                    state: { from: location },
                                }}
                            />
                        );
                    }
                    return children;
                }

                return (
                    <Redirect
                        to={{
                            pathname: '/create-store',
                            state: { from: location },
                        }}
                    />
                );
            }}
        />
    );
};

export { GuestRouter, UserRouter, CustomerRouter };
