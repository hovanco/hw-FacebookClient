import React, { lazy, Suspense } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { Loading } from '../../components';
import { SidebarLayout } from '../../layout';
import './style.less';
import { useNotification } from '../customer/notfication-context';

const LiveStreams = lazy(() => import('./scripts'));
const ScripStep = lazy(() => import('./script-step'));
const Script = lazy(() => import('./script'));
const ScriptEdit = lazy(() => import('./script-edit'));

interface Props {}

const LiveStream = (props: Props) => {
    const { path } = useRouteMatch();

    const { title } = useNotification();

    const title_page = `${title} Live stream`;

    return (
        <SidebarLayout title={title_page}>
            <div className='main'>
                <Suspense fallback={<Loading />}>
                    <Switch>
                        <Redirect exact from={path} to={`${path}/scripts`} />
                        <Route component={LiveStreams} path={`${path}/scripts`} exact />
                        <Route
                            component={Script}
                            path={`${path}/script/:fbPageId/:scriptId`}
                            exact
                        />
                        <Route
                            component={ScriptEdit}
                            path={`${path}/script/:fbPageId/:scriptId/edit`}
                        />
                        <Route component={ScripStep} path={`${path}/new`} />

                        <Redirect to='/page-not-found' />
                    </Switch>
                </Suspense>
            </div>
        </SidebarLayout>
    );
};

export default LiveStream;
