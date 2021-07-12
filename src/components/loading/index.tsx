import React, { FC } from 'react';
import { Spin } from 'antd';

import './style.less';

interface Props {
    full?: boolean;
}

const Loading: FC<Props> = ({ full }): JSX.Element => {
    const className = full ? `loading-wrap full` : 'loading-wrap';
    return (
        <div className={className}>
            <Spin />
        </div>
    );
};
export default Loading;
