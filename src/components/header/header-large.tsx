import React, { FC } from 'react';
import HeaderLeft from './header-left';
import HeaderRight from './header-right';

const HeaderLarge: FC = (): JSX.Element => {
    return (
        <div className='header-container'>
            <HeaderLeft />
            <HeaderRight />
        </div>
    );
};

export default HeaderLarge;
