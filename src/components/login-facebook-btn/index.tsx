import React, { FC, memo } from 'react';
import FacebookLogin from 'react-facebook-login';
import { FacebookFilled } from '@ant-design/icons';
import { FACEBOOK_APP_ID, FACEBOOK_SCOPE } from '../../configs/vars';

interface Props {
    loginFacebook: (data: any) => void;
    title?: string;
}

const LoginFacebookBtn: FC<Props> = ({
    loginFacebook,
    title = ' Đăng nhập với facebook',
}): JSX.Element => {
    return (
        <FacebookLogin
            appId={FACEBOOK_APP_ID}
            icon={<FacebookFilled />}
            size='small'
            textButton={title}
            autoLoad={false}
            fields='name,email,picture'
            scope={FACEBOOK_SCOPE}
            callback={loginFacebook}
            cssClass='ant-btn ant-btn-primary ant-btn-lg ant-btn-block'
            isMobile
            disableMobileRedirect
            version="9.0"
        />
    );
};

export default memo(LoginFacebookBtn);
