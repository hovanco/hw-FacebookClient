import { CloseOutlined, MenuOutlined } from '@ant-design/icons';
import React, { FC, memo, ReactElement } from 'react';

interface Props {
    show: boolean;
    onClick: () => void;
}

const styleIcon = {
    color: '#fff',
    fontSize: 20,
};

const IconMenu: FC<Props> = ({ show, onClick }): JSX.Element => {
    const renderIconMenu: ReactElement = show ? (
        <CloseOutlined style={styleIcon} />
    ) : (
        <MenuOutlined style={styleIcon} />
    );
    return (
        <div style={{ display: 'flex', alignItems: 'center' }} onClick={onClick}>
            {renderIconMenu}
        </div>
    );
};

export default memo(IconMenu);
