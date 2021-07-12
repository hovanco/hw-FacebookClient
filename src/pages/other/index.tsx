import React, { Suspense, lazy } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { Row, Col } from 'antd';

import { Loading } from '../../components';
import { CustomerLayout } from '../../layout';
import './style.less';

const Members = lazy(() => import('../members'));
const Settings = lazy(() => import('../settings'));
const Customers = lazy(() => import('../customers-other'));
const Warehouses = lazy(() => import('../warehouses'));

interface IProps {}

function Other(props: IProps): JSX.Element {
    const { path } = useRouteMatch();

    return (
        <CustomerLayout title='Other'>
            <Row style={{ minHeight: `calc(100vh - 50px)`, width: '100%' }}>
                <Col span={24} className='other-wrap'>
                    <Suspense fallback={<Loading full />}>
                        <Switch>
                            <Route component={Members} path={`${path}/members`} />
                            <Route component={Settings} path={`${path}/setting`} />
                            <Route component={Customers} path={`${path}/customer`} />
                            <Route component={Warehouses} path={`${path}/warehouse`} />
                            <Redirect to='/page-not-found' />
                        </Switch>
                    </Suspense>
                </Col>
            </Row>
        </CustomerLayout>
    );
}

export default Other;
