import React, { createContext, FC, ReactNode, useState, useContext, useEffect } from 'react';

interface Product {
    productId: string;
    count: number;
    price: number;
}

interface State {
    customer: {
        name: string;
        phoneNo: string;
        address: string;
        province: string | undefined;
        district: string | undefined;
        ward: string | undefined;
    };
    products: Product[];

    deliveryOptions: {
        serviceId?: number;
        transportType: number;
        shipmentFee: number;
        shipmentFeeForCustomer: number;
        shipmentFeeByTotal: boolean;
        discount: number;
        discountBy: number;
        feeForReceiver: Number;
        moneyForSender: number;
        customerNote: string;
        noteForCustomerCare: string;
        transportStatus: number;
        noteForDelivery?: string;
        transportLogs: {
            status: number;
            updatedAt: string;
        };
    };
}

export const initialOrder = {
    use_transformer: true,
    customer: {
        _id: '',
        fbUserId: '',
        name: '',
        phoneNo: '',
        address: '',
        province: undefined,
        district: undefined,
        ward: undefined,
    },
    products: [],
    deliveryOptions: {
        serviceId: undefined,
        transportType: undefined,
        shipmentFeeForCustomer: 0,
        shipmentFee: 0,
        customerNote: '',
        noteForCustomerCare: '',
        discount: 0,
        noteForDelivery: undefined,
        discountBy: 0,
    },
    warehouseId: undefined,
};

const initialCustomer = {
    _id: '',
    name: '',
    phoneNo: '',
    address: '',
    province: undefined,
    district: undefined,
    ward: undefined,
};

const initialState = {
    loading: false,
    order: initialOrder,
    infoCustomer: initialCustomer,
    customerObjectId: '',
};

const initalContext = {
    state: initialState,
    setState: (state: any): any => state,
};

const OrderContext = createContext(initalContext);

interface Props {
    children: ReactNode;
    order?: any;
}

const ProviderOrderContext: FC<Props> = ({ children, order }) => {
    const [state, setState] = useState(initialState);

    useEffect(() => {
        if (order) {
            setState({ ...state, order, infoCustomer: order.customer });
        }
    }, [order]);

    const value = { state, setState };
    return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

const useOrder = () => {
    const value = useContext(OrderContext);

    const { state, setState } = value;

    const setOrder = (order: any) => {
        setState({ ...state, order });
    };

    const setProducts = (products: any[]) => {
        setState({ ...state, order: { ...state.order, products } });
    };

    const resetOrder = () => {
        setState({
            ...state,
            order: initialOrder,
        });
    };

    const setInfoCustomer = (infoCustomer: any) => {
        setState({
            ...state,
            infoCustomer,
            customerObjectId: infoCustomer._id,
            order: { ...state.order, customer: infoCustomer },
        });
    };

    const setCustomerObjectId = (customerObjectId: string) => {
        setState({ ...state, customerObjectId });
    };

    return { ...state, setOrder, setProducts, resetOrder, setInfoCustomer, setCustomerObjectId };
};

export { ProviderOrderContext, useOrder };
