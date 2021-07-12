import { UserOutlined } from '@ant-design/icons';
import { Card, Col, Row, Space } from 'antd';
import moment from 'moment';
import React, { FC } from 'react';
import { CartIcon, FacebookIcon } from '../../../assets/icon';
import { ILivestreamScript } from '../../../collections/livestream-script';
import { TextEllipsis } from '../../../components';
import VideoThumnail from '../scripts/video-thumnail';
import LivestreamCustomer from './livestream-customer';
import PageApply from './page-apply';

interface Props {
    script: ILivestreamScript;
}
const ScriptReport: FC<Props> = ({ script }) => {
    return (
        <div className='livestream-report'>
            <Space size={30} direction='vertical' style={{ width: '100%' }}>
                <Card
                    title='Tổng quan về video livestream'
                    type='inner'
                    style={{ borderColor: '#cfd2d4' }}
                    headStyle={{ borderColor: '#cfd2d4' }}
                >
                    <Row gutter={20} justify='space-between'>
                        <Col style={{ width: '55%' }}>
                            <Row gutter={15}>
                                <Col>
                                    <VideoThumnail
                                        video={script.video}
                                        style={{ height: 100, width: 154 }}
                                    />
                                </Col>
                                <Col style={{ flex: 1, overflow: 'hidden' }}>
                                    <div>
                                        <TextEllipsis width={'100%'}>{script.name}</TextEllipsis>
                                    </div>
                                    <PageApply fbPageId={script.fbPageId} />
                                    <div>{`Bắt đầu lúc ${moment(script.createdAt).format(
                                        'DD/MM/YYYY HH:mm'
                                    )}`}</div>
                                    <div>{`Kết thúc lúc ${moment(script.updatedAt).format(
                                        'DD/MM/YYYY HH:mm'
                                    )}`}</div>
                                </Col>
                            </Row>
                        </Col>
                        <Col style={{ width: '45%' }}>
                            <Row gutter={20}>
                                <Col span={8}>
                                    <div className='statistic-item' style={{ background: '#fff' }}>
                                        <div className='number'>{script.customerCount}</div>
                                        <Row align='middle' gutter={5}>
                                            <Col>
                                                <UserOutlined />{' '}
                                            </Col>
                                            <Col>Khách hàng</Col>
                                        </Row>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className='statistic-item facebook-box'>
                                        <div className='number'>{script.commentCount}</div>
                                        <Row align='middle' gutter={5}>
                                            <Col>
                                                <FacebookIcon
                                                    style={{
                                                        border: '1px solid #fff',
                                                        borderRadius: '50%',
                                                    }}
                                                />
                                            </Col>
                                            <Col>Bình luận</Col>
                                        </Row>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className='statistic-item order-box'>
                                        <div className='number'>{script.orderCount}</div>
                                        <Row align='middle' gutter={5}>
                                            <Col>
                                                <CartIcon />
                                            </Col>
                                            <Col>Đơn hàng</Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card>

                <LivestreamCustomer script={script} />
            </Space>
        </div>
    );
};

export default ScriptReport;
