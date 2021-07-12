import React from 'react';
import { Link } from 'react-router-dom';

import Logo from '../logo';

const HeaderLeft = () => {
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link to='/'>
                <Logo type='light' style={{ height: 36 }} />
            </Link>
        </div>
    );
};

export default HeaderLeft;
