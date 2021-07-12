import React from 'react';
import Media from 'react-media';

import './style.less';
import HeaderLarge from './header-large';
import HeaderMobile from './header-mobile';

const Header = () => {
    return (
        <header className='header'>
            <div className='container'>
                <Media queries={{ small: '(max-width: 767px)' }}>
                    {(matches) => (matches.small ? <HeaderMobile /> : <HeaderLarge />)}
                </Media>
            </div>
        </header>
    );
};

export default Header;
