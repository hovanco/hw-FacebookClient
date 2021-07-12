import React, { memo } from 'react';
import { useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { Button } from 'antd';
import { PrimaryChevronRightIcon } from '../../assets/icon';
import imgPageNotFound from '../../assets/page-not-found.svg';
import imgPlus5 from '../../assets/plus-5.svg';

import './style.less';

function NotFound() {
    const history = useHistory();

    const handleBackHome = () => {
        history.replace('/');
    };

    return (
        <>
            <Helmet>
                <title>Không tìm thấy trang</title>
            </Helmet>
            <div className='page-404'>
                <div className='page-404__container'>
                    <div className='page-404__decorator-img'>
                        <img src={imgPlus5} alt='insa' />
                    </div>
                    <div className='page-404__picture'>
                        <img src={imgPageNotFound} alt='insa' />
                    </div>
                    <div className='page-404__text'>Không tìm thấy trang</div>
                    <div className='page-404__btn-back'>
                        <Button icon={<PrimaryChevronRightIcon />} onClick={handleBackHome}>
                            Trở về trang chủ
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default memo(NotFound);
