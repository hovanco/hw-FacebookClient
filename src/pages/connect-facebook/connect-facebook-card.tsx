import { FacebookFilled } from '@ant-design/icons';
import { Alert, Button, Card } from 'antd';
import React, { FC, useState, useEffect } from 'react';
import ReactFacebookLogin from 'react-facebook-login';
import { useDispatch, useSelector } from 'react-redux';

import { FACEBOOK_APP_ID, FACEBOOK_SCOPE } from '../../configs/vars';
import { connectFanpageAction } from '../../reducers/fanpageState/fanpageAction';
import fanpageTypes from '../../reducers/fanpageState/fanpageTypes';
import { useLocation } from 'react-router-dom';

const ConnectFacebookCard: FC = (): JSX.Element => {
    let location = useLocation();

    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const error = useSelector((state: any) => state.fanpage.error);

    const handleConnnectFanpage = async (response: any = {}) => {
        setLoading(true);

        const { accessToken } = response;
        await dispatch(connectFanpageAction({ shortLiveToken: accessToken }));
        setLoading(false);
    };

    const removeError = () => {
        dispatch({ type: fanpageTypes.REMOVE_ERROR_LOAD_FANPAGES });
    };

    useEffect(() => {
        removeError();
    }, [location]);

    const cssClass = 'ant-btn ant-btn-primary ant-btn-lg ant-btn-block';
    return (
        <div style={{ maxWidth: 350, width: '100%' }}>
            {error && (
                <Alert
                    message='Lỗi kết nối'
                    description='Tài khoản facebook đã được sử dụng, vui lòng chọn tài khoản khác'
                    type='error'
                    showIcon
                    closable
                    onClose={removeError}
                />
            )}

            <Card style={{ width: 350 }}>
                <div style={{ textAlign: 'center', marginBottom: 30 }}>
                    <h3 className='title-form'>Kết nối fanpage</h3>

                    <p>Bạn cần kết nối với facebook để sử dụng</p>
                </div>
                {loading ? (
                    <Button type='primary' block size='large' loading>
                        Đang kết nối với facebook
                    </Button>
                ) : (
                    <ReactFacebookLogin
                        appId={FACEBOOK_APP_ID}
                        icon={<FacebookFilled />}
                        size='small'
                        textButton=' Kết nối fanpage'
                        autoLoad={false}
                        fields='name,email,picture'
                        scope={FACEBOOK_SCOPE}
                        callback={handleConnnectFanpage}
                        cssClass={cssClass}
                        isMobile
                        disableMobileRedirect
                    />
                )}
            </Card>
        </div>
    );
};

export default ConnectFacebookCard;
