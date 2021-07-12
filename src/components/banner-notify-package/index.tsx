import { Button, Col, Row, Typography } from 'antd';
import moment from 'moment';
import React, { FC, useEffect, useState } from 'react';
import icActionsCloseSimple from '../../assets/images/ic-actions-close-simple.svg';
import constants from '../../constants';
import imageForBuy from '../../assets/images/image-for-buy.svg';
import './banner-notify-package.less';

const { Title } = Typography;

interface Props {
    expiredAtPackage?: string;
    isExpired?: boolean;
    handleCloseBanner?: Function;
}

const BannerNotifyPackageTrial: FC<Props> = ({
    expiredAtPackage,
    isExpired,
    handleCloseBanner,
}) => {
    const [willExpired, setWillExpired] = useState<boolean>(false);
    const [daysUntilExpiration, setDaysUntilExpiration] = useState<number>();

    useEffect(() => {
        setDaysUntilExpiration(Math.round(moment(expiredAtPackage).diff(moment(), 'days', true)));
        setWillExpired(isExpired);
    }, [expiredAtPackage, isExpired]);

    return (
        <Row className='banner-notify-package' align='middle' justify='center'>
            {isExpired && (
                <>
                    <Col>
                        <img src={imageForBuy} alt='icon' />
                    </Col>
                    <Col>
                        <Title level={5} className='notify-content'>
                            {willExpired
                                ? `Tài khoản dùng thử của bạn sẽ hết hạn trong ${daysUntilExpiration} ngày. 
                                Vui lòng mua gói dịch vụ để không bị gián đoạn`
                                : 'Tài khoản dùng thử của bạn đã hết hạn. Vui lòng mua gói dịch vụ để tiếp tục sử dụng'}
                        </Title>
                    </Col>
                    <Col span={1} />
                    <Col>
                        <Button className="insa-button" href={`${constants.URL_STORE}setting/billings/list`}>
                            Xem các gói
                        </Button>
                    </Col>
                    <Button type='text' className='btn-close' onClick={handleCloseBanner}>
                        <img src={icActionsCloseSimple} alt='icon' />
                    </Button>
                </>
            )}
        </Row>
    );
};

export default BannerNotifyPackageTrial;
