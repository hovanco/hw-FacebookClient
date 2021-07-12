import querystring from 'querystring';
import React, { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import storeApi from '../../api/store-api';
import { Page } from '../../reducers/fanpageState/fanpageReducer';
import { getEndTime, getStartTime } from '../report/util';

interface IState {
    loading: boolean;
    pageId: any;
    customers: any[];
    total: number;
    pageCustomer: number;
    type: string;
    date: number | any[];
}

const initialState: IState = {
    loading: false,
    pageId: null,
    customers: [],
    total: 0,
    pageCustomer: 1,
    type: 'month',
    date: Date.now(),
};

const initialContext = {
    state: initialState,
    setState: (state: any): any => state,
};

const Context = createContext(initialContext);

const ProviderCustomerContext: FC<{ children: ReactNode }> = ({ children }) => {
    const page = useSelector((state: any) => state.fanpage.page);
    const store = useSelector((state: any) => state.store.store);
    const token = useSelector((state: any) => state.auth.token);

    const [state, setState] = useState(() => {
        if (page) {
            return {
                ...initialState,
                pageId: page._id,
            };
        }

        return initialState;
    });

    useEffect(() => {
        async function handleFilter() {
            setState({ ...state, loading: true });

            try {
                const arg = { type: state.type, date: state.date };
                const fbPageId = state.pageId;
                const fromAt = getStartTime(arg);
                const toAt = getEndTime(arg);
                const query = querystring.stringify({ fbPageId, fromAt, toAt });
                const data = {
                    storeId: store._id,
                    token: token.accessToken,
                    page: initialState.pageCustomer,
                    limit: 10,
                    query,
                };
                const response = await storeApi.getListCustomers(data);

                setState({
                    ...state,
                    loading: false,
                    customers: response.data,
                    total: response.total,
                });
            } catch (error) {
                setState({
                    ...state,
                    loading: false,
                });
            }
        }

        if (state.pageId) {
            handleFilter();
        }
    }, []);

    return <Context.Provider value={{ state, setState }}>{children}</Context.Provider>;
};

const useContextCustomer = () => {
    const { state, setState } = useContext(Context);
    const store = useSelector((state: any) => state.store.store);
    const token = useSelector((state: any) => state.auth.token);
    const pages = useSelector((state: any) => state.fanpage.pages);

    const selectPage = (pageId: string) => {
        setState({ ...state, pageId: (pages[pageId] as Page)._id });
    };

    const selectDateType = (type: string) => {
        setState({ ...state, type, date: Date.now() });
    };

    const selectDate = (date: any) => {
        setState({ ...state, date });
    };

    const setPageCustomer = (pageCustomer: number) => {
        setState({ ...state, pageCustomer });
    };

    const handleFilter = async (pageNumber: number) => {
        setState({ ...state, loading: true });
        const arg = { type: state.type, date: state.date };
        const fbPageId = state.pageId;
        const fromAt = getStartTime(arg);
        const toAt = getEndTime(arg);
        const query = querystring.stringify({ fbPageId, fromAt, toAt });
        const data = {
            storeId: store._id,
            token: token.accessToken,
            page: pageNumber,
            limit: 10,
            query,
        };
        const response = await storeApi.getListCustomers(data);

        setState({
            ...state,
            customers: response.data,
            total: response.total,
            pageCustomer: pageNumber,
        });
    };

    return {
        ...state,
        selectPage,
        setPageCustomer,
        selectDateType,
        selectDate,
        handleFilter,
    };
};

export { ProviderCustomerContext, useContextCustomer };
