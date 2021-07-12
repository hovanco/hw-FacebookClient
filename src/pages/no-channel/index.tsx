import { Button, Card, Col, Row, Space, Typography } from 'antd';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Loading, Logo } from '../../components';
import HeaderRightAction from '../../components/header/header-right-action';
import constants from '../../constants';
import { BaseLayout } from '../../layout';
import { IStoreState } from '../../reducers/storeState/storeReducer';
import './style.less';

const HEIGHT_HEADER = '70px';

const Header: FC = () => {
    return (
        <Row
            justify='space-between'
            align='middle'
            style={{
                height: HEIGHT_HEADER,
                padding: '0 0  0 15px ',
            }}
        >
            <Col>
                <Logo style={{ height: 40 }} />
            </Col>
            <Col>
                <HeaderRightAction />
            </Col>
        </Row>
    );
};

const NoChannel: FC = () => {
    const loading = useSelector(({ store }: { store: IStoreState }) => store.loading);
    const store = useSelector(({ store }: { store: IStoreState }) => store.store);

    if (loading) {
        return <Loading full />;
    }

    if (store && store.saleChannels.includes('facebook')) {
        return <Redirect to='customer' />;
    }

    const gotoStore = () => {
        window.location.href = `${constants.URL_STORE}setting/sale-channel`;
    };

    return (
        <BaseLayout title='Đăng ký sử dụng'>
            <div className='no-channel'>
                <Header />
                <Row
                    justify='center'
                    align='middle'
                    style={{ minHeight: `calc(95vh - ${HEIGHT_HEADER})` }}
                >
                    <Col md={8}>
                        <Card
                            type='inner'
                            bodyStyle={{
                                padding: '30px 15px',
                            }}
                            style={{ textAlign: 'center' }}
                        >
                            <Space direction='vertical' size={20}>
                                <div>
                                    <Typography.Title type='danger' level={3}>
                                        Dịch vụ chưa đăng ký
                                    </Typography.Title>
                                    <Typography.Text className='no-channel__text'>
                                        Bạn chưa đăng ký sử dụng dịch vụ này. Nhấn vào nút bên dưới
                                        để đăng ký sử dụng.
                                    </Typography.Text>
                                </div>
                                <Button type='primary' size='large' onClick={gotoStore}>
                                    Đăng ký ngay
                                </Button>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </div>
        </BaseLayout>
    );
};

export default NoChannel;
