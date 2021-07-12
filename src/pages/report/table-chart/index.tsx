import React, { FC, ReactNode } from 'react';

import './style.less';

interface Props {
    children: ReactNode;
}

const TableChart: FC<Props> = ({ children }): JSX.Element => {
    return <table className='table-chart'>{children}</table>;
};

export default TableChart;
