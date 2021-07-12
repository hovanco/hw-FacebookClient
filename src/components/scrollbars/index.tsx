import React from 'react';
import Scrollbars from 'react-custom-scrollbars';

interface IProps {
    children: JSX.Element;
    [propsName: string]: any;
}

export default ({ children, ...rest }: IProps): JSX.Element => {
    return (
        <Scrollbars autoHide autoHideTimeout={1000} autoHideDuration={200} {...rest}>
            {children}
        </Scrollbars>
    );
};
