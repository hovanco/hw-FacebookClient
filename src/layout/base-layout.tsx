import React, { useEffect, ReactNode } from 'react';
import { Helmet } from 'react-helmet';

import constants from '../constants';

interface IProps {
    title?: string;
    children: ReactNode;
}

const BasetLayout = ({ title, children }: IProps) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            {children}
        </>
    );
};

BasetLayout.defaultProps = {
    title: constants.title,
};

export default BasetLayout;
