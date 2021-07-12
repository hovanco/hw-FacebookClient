import { Button, Col, Divider, Row, Space } from 'antd';
import { get, pick } from 'lodash';
import querystring from 'querystring';
import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getOrderDetail } from '../../../api/order-api';
import storeApi from '../../../api/store-api';
import { Loading } from '../../../components';
import AddProduct from '../../conversation/conversation-customer/add-product';
import {
    initialOrder,
    ProviderOrderContext,
} from '../../conversation/conversation-customer/context-order';
import OrderCustomerInfo from '../../conversation/conversation-customer/order-customer-info';
import OrderProductList from '../../conversation/conversation-customer/order-product-list';
import OrderStore from '../../conversation/conversation-customer/order-store';
import OrderTransport from '../../conversation/conversation-customer/order-transport';
import SearchProduct from '../../conversation/conversation-customer/search-product';
import BtnSave from './btn-save';

interface Props {
    orderId: string;
    customer: any;
    fbPageId: string;
    scriptId: string;
    toggle: () => void;
    setOrderCode: (code: string) => void;
    reloadCustomer: () => void;
}

const initOrder = {
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
        note: '',
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

const useFetchCustomer = (fbUserId: string) => {
    const store = useSelector((state: any) => state.store.store);
    const token = useSelector((state: any) => state.auth.token);
    const [customer, setCustomer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function getCustomer(id: string) {
            setLoading(true);
            const query = querystring.stringify({ fbUserId: id });

            const response = await storeApi.getListCustomers({
                storeId: store._id,
                token: token.accessToken,
                page: 1,
                limit: 1,
                query,
            });

            let data;
            if (response.data.length > 0) {
                data = {
                    _id: response.data[0]._id,
                    fbUserId: response.data[0].fbUserId,
                    name: response.data[0].name,
                    phoneNo: response.data[0].phoneNo,
                    address: response.data[0].address,
                    province: response.data[0].province,
                    district: response.data[0].district,
                    ward: response.data[0].ward,
                    note: response.data[0].note,
                };
            } else {
                data = {
                    _id: '',
                    fbUserId: fbUserId,
                    name: '',
                    phoneNo: '',
                    address: '',
                    province: undefined,
                    district: undefined,
                    ward: undefined,
                    note: undefined,
                };
            }

            setCustomer(data);
            setLoading(false);
        }

        if (fbUserId) {
            getCustomer(fbUserId);
        } else {
            setLoading(false);
        }
    }, [fbUserId, store._id, token.accessToken]);

    return { customer, loading };
};

const useFetchOrder = (orderId: string) => {
    const token = useSelector((state: any) => state.auth.token);
    const store = useSelector((state: any) => state.store.store);

    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState<any>(null);

    useEffect(() => {
        async function loadOrder(id: string) {
            try {
                setLoading(true);
                const response = await getOrderDetail({
                    token: token.accessToken,
                    storeId: store._id,
                    orderId: id,
                });

                const order = {
                    ...response,
                    deliveryOptions: !get(response, 'deliveryOptions.transportType')
                        ? {
                              serviceId: undefined,
                              transportType: undefined,
                              shipmentFeeForCustomer: 0,
                              shipmentFee: 0,
                              customerNote: '',
                              noteForCustomerCare: '',
                              discount: 0,
                              noteForDelivery: undefined,
                              discountBy: 0,
                          }
                        : response.deliveryOptions,
                    products: response.products.map((product: any) => {
                        return {
                            ...product,
                            ...product.productId,
                            productId: product.productId._id,
                        };
                    }),
                    warehouseId: get(response, 'warehouseId._id'),
                };

                setOrder(order);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }

        if (orderId) {
            loadOrder(orderId);
        } else {
            setLoading(false);
        }
    }, [orderId, store._id, token.accessToken]);

    return { loading, order, setOrder };
};

const OrderDetail: FC<Props> = ({
    orderId,
    customer,
    fbPageId,
    scriptId,
    toggle,
    setOrderCode,
    reloadCustomer,
}) => {
    const { loading, order } = useFetchOrder(orderId);
    const { customer: customer_detail, loading: loadingCustomer } = useFetchCustomer(
        customer.fbUserId
    );

    useEffect(() => {
        if (order) {
            setOrderCode(order.code);
        }
    }, [order]);

    if (loading || loadingCustomer) return <Loading />;

    const order_local = order
        ? {
              ...order,
              customer: {
                  ...customer_detail,
                  name: customer.fbUserName,
                  phoneNo: customer.phoneNo,
                  province: customer.province,
                  district: customer.district,
                  ward: customer.ward,
                  address: customer.address,
              },
          }
        : {
              ...initialOrder,
              customer: {
                  ...customer_detail,
                  name: customer.fbUserName,
                  fbUserId: customer.fbUserId,
                  phoneNo: customer.phoneNo,
                  province: customer.province,
                  district: customer.district,
                  ward: customer.ward,
                  address: customer.address,
              },
          };

    return (
        <ProviderOrderContext order={order_local}>
            <Row gutter={20}>
                <Col span={12}>
                        <OrderCustomerInfo
                            defaultActiveKey={['customer']}
                            dataCustomer={order_local.customer}
                        />
                        <Divider style={{ marginTop: 0, marginBottom: 10 }} />
                        <OrderStore />
                        <SearchProduct />
                        <OrderProductList />
                        <AddProduct />
                </Col>
                <Col span={12}>
                        <OrderTransport hasOrder={!!get(order, 'warehouseId')} />
                </Col>
            </Row>
            <Divider />
            <Row gutter={15} justify='end'>
                <Col>
                    <Button onClick={toggle}>Đóng</Button>
                </Col>
                {(!order || order.isDraft) && (
                    <Col>
                        <BtnSave
                            isNew={!order}
                            fbPageId={fbPageId}
                            scriptId={scriptId}
                            customerId={customer_detail && customer_detail._id}
                            toggle={toggle}
                            reloadCustomer={reloadCustomer}
                        />
                    </Col>
                )}
            </Row>
        </ProviderOrderContext>
    );
};

export default OrderDetail;
