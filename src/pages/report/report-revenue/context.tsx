import { pick } from 'lodash';
import React, { createContext, FC, ReactNode, useContext, useState } from 'react';
import { useSelector } from 'react-redux';

import reportApi from '../../../api/report-api';
import { Page } from '../../../reducers/fanpageState/fanpageReducer';
import { getEndTime, getStartTime } from '../util';
import { message } from 'antd';

interface IContext {
    type: string;
    date: number | any[];
    loading: boolean;
    pageId: any;
    data: any[];
}

const initialContext: IContext = {
    type: 'day',
    date: Date.now(),
    pageId: null,
    loading: false,
    data: [],
};

interface IState {
    state: IContext;
    setState: (state: IContext) => void;
}

const initilState: IState = {
    state: initialContext,
    setState: (state) => state,
};

const ReportLabelContext = createContext<IState>(initilState);

const ProviderReportRevenue: FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState(initialContext);

    return (
        <ReportLabelContext.Provider value={{ state, setState }}>
            {children}
        </ReportLabelContext.Provider>
    );
};

const useReportRevenueContext = () => {
    const value = useContext(ReportLabelContext);
    const store = useSelector((state: any) => state.store.store);
    const token = useSelector((state: any) => state.auth.token);
    const pages = useSelector((state: any) => state.fanpage.pages);

    const { state, setState } = value;

    const selectDateType = (type: string) => {
        setState({ ...state, type, date: Date.now() });
    };

    const selectDate = (date: any) => {
        setState({ ...state, date });
    };

    const selectPage = (pageId: string) => {
        setState({ ...state, pageId: (pages[pageId] as Page).fbObjectId });
    };

    const handleFilter = async () => {
        setState({ ...state, loading: true });
        try {
            const arg = pick(state, ['type', 'date']);

            const data = {
                storeId: store._id,
                pageId: state.pageId || '',
                startTime: getStartTime(arg),
                endTime: getEndTime(arg),
                token: token.accessToken,
            };
            const response = await reportApi.reporRevenue(data);
            setState({ ...state, data: response, loading: false });
        } catch (error) {
            message.error('Đã có lỗi xảy ra khi lấy dữ liệu báo cáo');
            setState({ ...state, data: [], loading: false });
        }
    };

    return {
        ...state,
        selectDateType,
        selectDate,
        handleFilter,
        selectPage,
    };
};

export { ProviderReportRevenue, useReportRevenueContext };
