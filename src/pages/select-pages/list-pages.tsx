import React from 'react';
import { BottomText } from '../../components';
import TableListPages from './table-list-page';

function ListPages(): JSX.Element {
    return (
        <div className='page-list'>
            <TableListPages />
            <BottomText />
        </div>
    );
}

export default ListPages;
