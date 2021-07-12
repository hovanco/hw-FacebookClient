import React from 'react';

import ListPages from './list-pages';
import { Scrollbars } from '../../components';
import { BaseLayout } from '../../layout';
import HeaderRight from '../../components/header-customer/header-right';
import './style.less';

function SelectPages(): JSX.Element {
    const height = 'calc(100vh - 50px)';

    return (
        <BaseLayout>
            <div className='main'>
                <HeaderRight title='' />

                <div className='content'>
                    <Scrollbars style={{ height }}>
                        <ListPages />
                    </Scrollbars>
                </div>
            </div>
        </BaseLayout>
    );
}

export default SelectPages;
