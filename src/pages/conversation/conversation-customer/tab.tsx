import React, { FC, memo } from 'react';
import { useOrder } from './context-order';

interface Props {
    active?: boolean;
    tab: { key: string; title: string };
    onClick: (key: string) => void;
}

const Tab: FC<Props> = ({ active = false, onClick, tab }): JSX.Element => {
    const { infoCustomer } = useOrder();

    const disable = tab.key === '2' && (!infoCustomer._id || infoCustomer._id.length === 0);

    const handleOnClick = () => {
        if (!disable) {
            onClick(tab.key);
        }
    };

    const getClassName = (): string => {
        let className = 'tab';
        if (active) className = `${className} active`;
        if (disable) className = `${className} disable`;

        return className;
    };

    return (
        <div className={getClassName()} onClick={handleOnClick}>
            {tab.title}
        </div>
    );
};

export default memo(Tab);
