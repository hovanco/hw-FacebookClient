import React from 'react';
import { Button } from 'antd';
import { dataActiveScript } from '../../../data';
import { reverse } from 'lodash';

interface Props {
    onChange?: Function;
    value: any;
}

const RightSideActive = (props: Props) => {
    const setType = (status: number) => {
        props.onChange && props.onChange(status);
    };

    return (
        <div className='right-side-action-type'>
            {reverse(Object.values(dataActiveScript)).map((triggerStatus: any) => (
                <Button
                    type={props.value === triggerStatus.id ? 'primary' : 'default'}
                    onClick={() => setType(triggerStatus.id)}
                >
                    {triggerStatus.title}
                </Button>
            ))}
        </div>
    );
};

export default RightSideActive;
