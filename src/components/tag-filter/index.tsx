import { Tag } from 'antd';
import React, { FC } from 'react';

import './style.less';

const TagFilter: FC<any> = (props) => {
    return <Tag {...props} className='tag-filter' />;
};

export default TagFilter;
