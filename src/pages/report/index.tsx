import React, { FC, lazy, Suspense } from 'react';
import { Switch, Redirect, useRouteMatch, Route } from 'react-router-dom';
import { SidebarLayout } from '../../layout';
import { Loading } from '../../components';
import './style.less';

const ReportConversation = lazy(() => import('./report-conversation'));
const ReportLabel = lazy(() => import('./report-label'));
const ReportRevenue = lazy(() => import('./report-revenue'));

const Report: FC = (): JSX.Element => {
    const { path } = useRouteMatch();

    return (
        <SidebarLayout>
            <div className='main'>
                <Suspense fallback={<Loading />}>
                    <Switch>
                        <Redirect exact from={path} to={`${path}/conversation`} />

                        <Route path={`${path}/conversation`} component={ReportConversation} />
                        <Route path={`${path}/label`} component={ReportLabel} />
                        <Route path={`${path}/revenue`} component={ReportRevenue} />
                        <Redirect to='/page-not-found' />
                    </Switch>
                </Suspense>
            </div>
        </SidebarLayout>
    );
};

export default Report;
