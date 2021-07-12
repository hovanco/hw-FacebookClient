import { ConnectedRouter } from 'connected-react-router';
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { Loading } from '../components';
import { IAuthState } from '../reducers/authState/authReducer';
import { history } from '../store';
import { CustomerRouter, GuestRouter, UserRouter } from './auth-router';
import { useProgressAuth } from './use-progress-auth';

const Login = lazy(() => import('../pages/login'));
const Customer = lazy(() => import('../pages/customer'));
const CreateStore = lazy(() => import('../pages/create-store'));
const ConnectFacebook = lazy(() => import('../pages/connect-facebook'));
const NotFound = lazy(() => import('../pages/not-found'));
const SaveToken = lazy(() => import('../pages/save-token'));
const NoChannel = lazy(() => import('../pages/no-channel'));

export interface AuthState {
    auth: IAuthState;
}

function AppRouter(): JSX.Element {
    const { loading, progress, isAuth } = useProgressAuth();

    if ((progress || loading) && isAuth) return <Loading full />;

    return (
        <Router>
            <Suspense fallback={<Loading full />}>
                <ConnectedRouter history={history}>
                    <Switch>
                        <Redirect exact from='/' to={`/customer/conversation`} />

                        <GuestRouter path='/login'>
                            <Login />
                        </GuestRouter>
                        <GuestRouter path='/save-token'>
                            <SaveToken />
                        </GuestRouter>

                        <CustomerRouter path='/customer'>
                            <Customer />
                        </CustomerRouter>

                        <UserRouter path='/create-store'>
                            <CreateStore />
                        </UserRouter>

                        <Route path='/no-channel'>
                            <NoChannel />
                        </Route>

                        <UserRouter path='/connect-fanpage'>
                            <ConnectFacebook />
                        </UserRouter>

                        <Route path='/page-not-found' component={NotFound} />
                        <Redirect to='/page-not-found' />
                    </Switch>
                </ConnectedRouter>
            </Suspense>
        </Router>
    );
}

export default AppRouter;
