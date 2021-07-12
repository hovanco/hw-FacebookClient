import { Button, Col, Row, Space, Typography } from 'antd';
import React, { FC } from 'react';
import icActionsCloseSimple from '../../assets/images/ic-actions-close-simple.svg';
import imageForBuy from '../../assets/images/image-for-buy.svg';
import constants from '../../constants';
import './banner-notify-package.less';

const { Title } = Typography;

interface Props {
    expired?: number;
    isExpired?: boolean;
    handleCloseBanner?: Function;
    namePackage?: string;
}

const BannerNotifyPackage: FC<Props> = ({ expired, handleCloseBanner, namePackage }) => {
    return (
        <Row className='banner-notify-package' align='middle' justify='center'>
            <Col>
                <img src={imageForBuy} alt='icon' />
            </Col>
            <Col span={1} />
            <Col>
                <Space>
                    {expired === 0 ? (
                        <Title level={4}>Gói dịch vụ của bạn đã hết hạn</Title>
                    ) : (
                        <>
                            <Title level={4}>Gói dịch vụ</Title>
                            <Title level={3}>{namePackage}</Title>
                            <Title level={4}>của bạn sắp hết hạn</Title>
                        </>
                    )}
                </Space>
            </Col>
            <Col span={1} />
            <Col>
                <Button className="insa-button" href={`${constants.URL_STORE}setting/billings/list`}>
                    Thay đổi gói dịch vụ
                </Button>
            </Col>
            <Button type='text' className='btn-close' onClick={handleCloseBanner}>
                <img src={icActionsCloseSimple} alt='icon' />
            </Button>
        </Row>
    );
};

export default BannerNotifyPackage;
