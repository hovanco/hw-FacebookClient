import React, { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { getOrderDetail } from '../../api/order-api';
import { Loading } from '../../components';
import OrderNotFound from './order-not-found';
import './style.less';

interface State {
    loading: boolean;
    order: any;
}

const initialState = {
    loading: false,
    order: null,
};

const initialContext = {
    state: initialState,
    setState: (state: State): any => state,
};

const Context = createContext(initialContext);

interface Props {
    children: ReactNode;
}

interface Params {
    id: string;
}

const ProviderContextOrder: FC<Props> = ({ children }) => {
    const params = useParams<Params>();
    const store = useSelector((state: any) => state.store.store);
    const token = useSelector((state: any) => state.auth.token);
    const [state, setState] = useState<State>(initialState);

    const value = { state, setState };

    useEffect(() => {
        async function loadOrder() {
            setState({ ...state, loading: true });
            try {
                const response = await getOrderDetail({
                    orderId: params.id,
                    storeId: store._id,
                    token: token.accessToken,
                });

                setState({
                    ...state,
                    order: {
                        ...response,
                        products: response.products.filter((p: any) => p.productId),
                    },
                    loading: false,
                });
            } catch (error) {
                setState({ ...state, loading: false });
            }
        }

        if (params.id) {
            loadOrder();
        }
    }, []);

    const renderContent = () => {
        if (state.loading) return <Loading full />;
        if (!state.order) return <OrderNotFound />;

        return children;
    };

    return (
        <Context.Provider value={value}>
            <div className='order-detail'>{renderContent()}</div>
        </Context.Provider>
    );
};

const useOrderDetail = () => {
    const { state, setState } = useContext(Context);

    const changeOrder = (order: any) => {
        return setState({
            ...state,
            order,
        });
    };

    return {
        ...state,
        setState,
        changeOrder,
    };
};

export { ProviderContextOrder, useOrderDetail };
