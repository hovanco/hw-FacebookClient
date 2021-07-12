import React, { FC, memo } from 'react';

import constants from '../../constants';
import logo_dark from './insa-fb-logo-large.svg';
import logo_light from './insa-fb-logo-large-light.svg';
import logo_short from './insa-fb-logo-tiny.svg';
import './style.less';

interface Props {
    type?: 'light' | 'dark';
    style?: any;
    short?: boolean;
}

const Logo: FC<Props> = ({ type = 'dark', style, short = false }): JSX.Element => {
    const src = short ? logo_short : type === 'dark' ? logo_dark : logo_light;

    return <img src={src} alt={constants.title} style={style} />;
};

export default memo(Logo);
