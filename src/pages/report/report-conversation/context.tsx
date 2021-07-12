import React, { createContext, FC, ReactNode, useContext, useState } from 'react';
import { useSelector } from 'react-redux';

import reportApi from '../../../api/report-api';
import { Page } from '../../../reducers/fanpageState/fanpageReducer';
import { getEndTime, getStartTime } from '../util';

interface IContext {
    type: string;
    date: number | any[];
    loading: boolean;
    pageId: any;
    data: any;
}

const initialContext: IContext = {
    type: 'month',
    date: Date.now(),
    pageId: null,
    loading: false,
    data: null,
};

interface IState {
    state: IContext;
    setState: (state: IContext) => void;
}

const initilState: IState = {
    state: initialContext,
    setState: (state) => state,
};

const ReportConversationContext = createContext<IState>(initilState);

const ProviderReportConversation: FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState(initialContext);

    return (
        <ReportConversationContext.Provider value={{ state, setState }}>
            {children}
        </ReportConversationContext.Provider>
    );
};

const useReportConversationContext = () => {
    const value = useContext(ReportConversationContext);
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
            const arg = { type: state.type, date: state.date };
            const data = {
                storeId: store._id,
                pageId: state.pageId || '',
                startTime: getStartTime(arg),
                endTime: getEndTime(arg),
                token: token.accessToken,
            };
            const response = await reportApi.reportConversation(data);

            setState({ ...state, data: response, loading: false });
        } catch (error) {
            setState({ ...state, loading: false });
        }
    };

    return {
        ...state,
        selectDateType,
        selectDate,
        selectPage,
        handleFilter,
    };
};

export { ProviderReportConversation, useReportConversationContext };
