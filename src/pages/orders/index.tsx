import React, { FC, lazy, Suspense } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

import { Loading } from '../../components';
import OrderDetail from '../order-detail';
import './style.less';

const OrderHome = lazy(() => import('./order-home'));

const Order: FC = (): JSX.Element => {
    const { path } = useRouteMatch();

    return (
        <div className='order-wrap main'>
            <Suspense fallback={<Loading />}>
                <Switch>
                    <Route component={OrderHome} path={path} exact />
                    <Route component={OrderDetail} path={`${path}/:id`} />
                    <Redirect to='/page-not-found' />
                </Switch>
            </Suspense>
        </div>
    );
};

export default Order;
