import React, { FC } from 'react';
import { Button } from 'antd';
import { filter } from 'lodash';
import { FilterFilled, FilterOutlined } from '@ant-design/icons';

interface IFilter {
    pageId: string;
    date: any;
    type: string;
}

interface Props {
    loading: boolean;
    values: IFilter;
    onClick: () => void;
}

const ButtonFilter: FC<Props> = ({ loading, values, onClick }) => {
    const disabled = filter(values, (i) => !i).length > 0;

    return (
        <Button
            disabled={disabled}
            loading={loading}
            onClick={onClick}
            type='primary'
            icon={<FilterOutlined />}
        >
            Lọc
        </Button>
    );
};

export default ButtonFilter;
