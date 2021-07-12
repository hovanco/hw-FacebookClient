import { message } from 'antd';
import * as queryString from 'query-string';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setToken } from '../../api/token';
import { Loading } from '../../components';
import useHiddenModalExpired from '../../hooks/use-hidden-modal-expired';
import { BaseLayout } from '../../layout';
import { getUserAction } from '../../reducers/authState/authAction';
import types from '../../reducers/authState/authTypes';

interface Props {}

const SaveToken: FC<Props> = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { removeValueHidden } = useHiddenModalExpired();

    const searchState: {
        token?: string;
        remember?: string;
        location?: string;
        guest?: string;
    } = queryString.parse(history.location.search);

    const saveAndLoadUser = async (): Promise<void> => {
        const { token, location, guest } = searchState;

        if (!location) {
            return;
        }
        const locationValue: Location = JSON.parse(location);
        if (guest === 'true') {
            history.replace(locationValue);
            return;
        }
        if (!token) {
            return;
        }
        const tokenValue = JSON.parse(token);

        await localStorage.removeItem('shortLiveToken');
        await setToken({ token: tokenValue });
        await dispatch({
            type: types.LOGIN_SUCCESSS,
            payload: tokenValue,
        });
        await dispatch(getUserAction());
        message.success('Đăng nhập thành công');
        removeValueHidden();

        //  history.replace(`/customer`);
    };

    useEffect(() => {
        saveAndLoadUser();
    }, []);

    return (
        <BaseLayout title='Login'>
            <Loading full />
        </BaseLayout>
    );
};

export default SaveToken;
