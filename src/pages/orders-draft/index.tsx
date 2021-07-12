import React, { lazy, Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { Loading } from '../../components';
import { loadOrdersDraft } from '../../reducers/orderDraftState/orderDraftAction';
import './style.less';

const OrderDetail = lazy(() => import('../order-detail'));
const OederDraftHome = lazy(() => import('./order-draft-home'));

export const LIMIT = 20;

const OrderDraft = (): JSX.Element => {
    const dispatch = useDispatch();
    const { path } = useRouteMatch();

    useEffect(() => {
        dispatch(loadOrdersDraft({ page: 1, limit: LIMIT }));
    }, []);

    return (
        <div className='order-draft main'>
            <Suspense fallback={<Loading />}>
                <Switch>
                    <Route component={OederDraftHome} path={path} exact />
                    <Route component={OrderDetail} path={`${path}/:id`} />
                    <Redirect to='/page-not-found' />
                </Switch>
            </Suspense>
        </div>
    );
};

export default OrderDraft;
