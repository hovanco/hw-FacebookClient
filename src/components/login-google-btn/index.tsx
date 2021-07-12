import { GoogleCircleFilled } from '@ant-design/icons';
import { Button } from 'antd';
import React, { FC, memo } from 'react';
import { useGoogleLogin } from 'react-google-login';
import { GOOGLE_APP_ID } from '../../configs/vars';

interface Props {
    style?: {};
    loginGoogle: (arg: any) => void;
    title?: string;
}

const LoginGoogleBtn: FC<Props> = ({
    style,
    loginGoogle,
    title = '  Đăng nhập với google',
}): JSX.Element => {
    const { signIn, loaded } = useGoogleLogin({
        clientId: GOOGLE_APP_ID,
        onSuccess: loginGoogle,
        onFailure: () => {},
    });

    return (
        <Button
            type='primary'
            size='large'
            danger
            block
            icon={<GoogleCircleFilled />}
            onClick={signIn}
            style={{ ...style }}
            disabled={!loaded}
        >
            {title}
        </Button>
    );
};

export default memo(LoginGoogleBtn);
