import React, { FC } from 'react';
import { Button } from 'antd';
import { RightCircleFilled } from '@ant-design/icons';

import i_trouble from '../../assets/i_trouble.svg';
import './style.less';
import { Helmet } from 'react-helmet';

interface Props {}

const ErrorPage: FC<Props> = ({}): JSX.Element => {
    const goHomepage = () => {
        window.location.href = window.location.origin;
    };

    return (
        <>
            <Helmet>
                <title>Đã có lỗi khi tải trang</title>
            </Helmet>
            <div className='error-page'>
                <div className='content'>
                    <div>
                        <h1>Đã có lỗi khi tải trang</h1>
                        <p className='description'>
                            Vui lòng tải lại trang hoặc liên hệ với chúng tôi để được hỗ trợ sớm
                            nhất
                        </p>

                        <Button size='large' className='btn-home' onClick={goHomepage}>
                            Trở về trang chủ{' '}
                            <RightCircleFilled style={{ fontSize: 24, color: '#0972d7' }} />
                        </Button>
                    </div>
                    <img src={i_trouble} alt='' />
                </div>
            </div>
        </>
    );
};

export default ErrorPage;
