import { filter } from 'lodash';
import React, { FC, lazy, Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { HeaderCustomer, Loading } from '../../components';
import { BaseLayout } from '../../layout';
import { isActivePage, loadFanpageAction } from '../../reducers/fanpageState/fanpageAction';
import { IFacebookState } from '../../reducers/fanpageState/fanpageReducer';
import { IStoreState } from '../../reducers/storeState/storeReducer';
import ConnectFacebookCard from '../connect-facebook/connect-facebook-card';
import HeaderRight from '../../components/header-customer/header-right';
import Socket from '../conversation/socket-handle';
import { ProviderNotification } from './notfication-context';
import './style.less';
import { ExpriedPackageContext } from './expried-package-context';

const Conversation = lazy(() => import('../conversation'));
const LiveStream = lazy(() => import('../live-stream'));
const Report = lazy(() => import('../report'));
const Products = lazy(() => import('../products'));
const Order = lazy(() => import('../orders'));
const OrderDraft = lazy(() => import('../orders-draft'));
const SelectPages = lazy(() => import('../select-pages'));
const Other = lazy(() => import('../other'));

const Customer: FC = (): JSX.Element => {
    const dispatch = useDispatch();
    const { path } = useRouteMatch();

    const pages = useSelector(({ fanpage }: { fanpage: IFacebookState }) => fanpage.pages);
    const allPages = useSelector(({ fanpage }: { fanpage: IFacebookState }) => fanpage.allPages);
    const loading = useSelector(({ fanpage }: { fanpage: IFacebookState }) => fanpage.loading);
    const store = useSelector(({ store }: { store: IStoreState }) => store.store);

    useEffect(() => {
        dispatch(loadFanpageAction());
    }, []);

    const renderRouter = () => {
        if (!store) {
            return <Redirect to='/create-store' />;
        }

        if (!loading && !Object.keys(allPages).length) {
            return (
                <BaseLayout>
                    <div className='main'>
                        <HeaderRight title='' />

                        <div className='card-connect-fb content'>
                            <ConnectFacebookCard />
                        </div>
                    </div>
                </BaseLayout>
            );
        }

        const activePages = filter(pages, (page) => isActivePage(page));

        if (activePages.length === 0) {
            return <SelectPages />;
        }

        return (
            <ProviderNotification>
                <Switch>
                    <Redirect path={`${path}`} to={`${path}/conversation`} exact />
                    <Route path={`${path}/conversation`} component={Conversation} />
                    <Route path={`${path}/livestream`} component={LiveStream} />
                    <Route path={`${path}/report`} component={Report} />
                    <Route path={`${path}/products`} component={Products} />
                    <Route path={`${path}/select-pages`} component={SelectPages} />
                    <Route path={`${path}/other`} component={Other} />

                    <Route path={`${path}/order`} component={Order} />
                    <Route path={`${path}/order-draft`} component={OrderDraft} />

                    <Redirect to='/page-not-found' />
                </Switch>
                <Socket />
            </ProviderNotification>
        );
    };

    if (loading) return <Loading full />;

    return (
        <ExpriedPackageContext>
            <div className='customer-wrap'>
                <HeaderCustomer />

                <Suspense fallback={<Loading full />}>{renderRouter()}</Suspense>
            </div>
        </ExpriedPackageContext>
    );
};

export default Customer;
