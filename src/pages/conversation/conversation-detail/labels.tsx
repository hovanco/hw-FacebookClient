import { Space } from 'antd';
import React, { FC } from 'react';
import { useConversationDetail } from './context';
import Label from './label';

export interface LabelType {
    _id: string;
    name: string;
    color: string;
    backgroundColor: string;
    order: number;
}

const Labels: FC = (): JSX.Element => {
    const { labelIds } = useConversationDetail();

    if (!labelIds || labelIds.length === 0) return <div />;

    const renderLabels = () => {
        return labelIds.map((label) => <Label label={label} key={label._id} close />);
    };

    return <div className='labels'>{renderLabels()}</div>;
};

export default Labels;
