import React, { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import labelApi from '../../../api/label-api';
import { Loading } from '../../../components';
import { Page } from '../../../reducers/fanpageState/fanpageReducer';

interface IState {
    loading: boolean;
    page: string | null;
    labels: any[];
    labelIds: string[];
}

const initialState: IState = {
    loading: true,
    page: null,
    labels: [],
    labelIds: [],
};

const initialContext = {
    state: initialState,
    setState: (state: any): any => state,
};

const Context = createContext(initialContext);

interface Props {
    children: ReactNode;
}

const ProviderLabelContext: FC<Props> = ({ children }): JSX.Element => {
    const [state, setState] = useState(initialState);
    const store = useSelector((state: any) => state.store.store);
    const pages = useSelector((state: any) => state.fanpage.pages);
    const page = useSelector((state: any) => state.fanpage.page);
    const loading = useSelector((state: any) => state.fanpage.loading);

    useEffect(() => {
        if (page) {
            setState({ ...state, page: page._id });
        } else {
            const keys: string[] = Object.keys(pages);
            if (keys.length > 0) {
                setState({ ...state, page: keys[0] });
            }
        }
    }, []);

    useEffect(() => {
        async function loadLabels() {
            try {
                setState({ ...state, loading: true });
                const data = {
                    storeId: store._id,
                    pageId: (pages[state.page as string] as Page).fbObjectId,
                };

                const labels = await labelApi.getListLabels(data);

                return setState({ ...state, labels, loading: false });
            } catch (error) {
                return setState({ ...state, loading: false });
            }
        }

        if (state.page) {
            loadLabels();
        }
    }, [state.page]);

    if (loading) return <Loading full />;

    return <Context.Provider value={{ state, setState }}>{children}</Context.Provider>;
};

const useContextLabel = () => {
    const { state, setState } = useContext(Context);

    const selectPage = (page: string) => {
        setState({ ...state, page });
    };

    const setLabelIds = (labelIds: string[]) => {
        setState({
            ...state,
            labelIds,
        });
    };

    return {
        ...state,
        selectPage,
        setLabelIds,
    };
};

export { ProviderLabelContext, useContextLabel };
