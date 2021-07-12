import React, { FC } from 'react';

interface Props {
    type: string;
}

const TabContent: FC<Props> = ({ type }): JSX.Element => {
    return <div className='order-wrap'>Updating...</div>;
};

export default TabContent;
