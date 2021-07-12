import React, { FC, ReactNode, memo } from 'react';
import { Helmet } from 'react-helmet';

import { Header, Footer } from '../components';
import './default-layout.less';
import constants from '../constants';

interface Props {
    children: ReactNode;
    title?: string;
}

const DefaultLayout: FC<Props> = ({ children, title }) => {
    return (
        <>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <Header />
            <div className='wrap'>{children}</div>

            <Footer />
        </>
    );
};

DefaultLayout.defaultProps = {
    title: constants.title,
};

export default memo(DefaultLayout);
