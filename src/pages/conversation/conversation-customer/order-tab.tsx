import { SaveOutlined } from '@ant-design/icons';
import { Button, message, Space, Divider } from 'antd';
import { get, isEmpty, pick } from 'lodash';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import storeApi from '../../../api/store-api';
import AddProduct from './add-product';
import { useOrder } from './context-order';
import OrderDone from './order-done';
import OrderProductList from './order-product-list';
import OrderStore from './order-store';
import OrderTransport from './order-transport';
import SearchProduct from './search-product';
import { getFee } from './util';
import OrderCustomerInfo from './order-customer-info';
import useHiddenModalExpired from '../../../hooks/use-hidden-modal-expired';

export interface IOrder {
    pageId: string;
    order_name: string;
    order_phone: string;
    order_email: string;
    address: string;
    addressInfo: {
        city: any;
        district: any;
        ward: any;
    };
    list_order: any[];
    type_order: string;
    shiper: string | null;
    phi_van_chuyen: number;
    phi_bao_khach: number;
    chiet_khau: {
        type: string;
        value: number;
    };
    customer_note: string;
    cskh_note: string;
    store: any;
    tien_chuyen_khoan: number;
    tien_coc: number;
}

interface Props {}

const OrderTab = (props: Props) => {
    const token = useSelector((state: any) => state.auth.token);
    const store = useSelector((state: any) => state.store.store);
    const page = useSelector((state: any) => state.fanpage.page);
    const conversation = useSelector((state: any) => state.fanpage.conversation);

    const { order, resetOrder, customerObjectId, setCustomerObjectId } = useOrder();
    const [submit, setSubmit] = useState(false);
    const [done, setDone] = useState(false);
    const { hiddenModalExpired } = useHiddenModalExpired();

    const toggleDone = () => {
        resetOrder();
        setDone(!done);
    };

    const saveOrder = async () => {
        try {
            setSubmit(true);
            let newCustomerId;
            if (isEmpty(customerObjectId)) {
                const dataCustomer = {
                    ...pick(order.customer, [
                        'name',
                        'phoneNo',
                        'address',
                        'province',
                        'district',
                        'ward',
                    ]),
                    fbPageId: store.activePage._id,
                    fbUserId: conversation.fbUserId,
                };
                const newCustomer = await storeApi.createCustomer({
                    token: token.accessToken,
                    storeId: store._id,
                    data: dataCustomer,
                });
                newCustomerId = newCustomer._id;
                order.customer = newCustomer;
            }

            const products = order.products.map((p: any) =>
                pick(p, ['count', 'productId', 'price']),
            );

            const valueShipmentFeeForCustomer = get(
                order,
                'deliveryOptions.shipmentFeeForCustomer',
            );

            const shipmentFeeForCustomer =
                !valueShipmentFeeForCustomer || valueShipmentFeeForCustomer === 0
                    ? get(order, 'deliveryOptions.shipmentFee')
                    : valueShipmentFeeForCustomer;

            const data = {
                products,
                customer: pick(order.customer, [
                    '_id',
                    'fbUserId',
                    'name',
                    'phoneNo',
                    'address',
                    'province',
                    'district',
                    'ward',
                ]),
                fbPageId: page.fbObjectId,
                deliveryOptions: {
                    ...pick(order.deliveryOptions, [
                        'shipmentFee',
                        'discount',
                        'discountBy',
                        'noteForDelivery',
                    ]),
                    shipmentFeeForCustomer,
                    serviceId: order.deliveryOptions.serviceId || 0,
                    transportType: order.deliveryOptions.transportType || 0,
                    customerNote:
                        order.deliveryOptions.customerNote.length > 0
                            ? order.deliveryOptions.customerNote
                            : undefined,
                    noteForCustomerCare:
                        order.deliveryOptions.noteForCustomerCare.length > 0
                            ? order.deliveryOptions.noteForCustomerCare
                            : undefined,

                    feeForReceiver: getFee(order).feeForReceiver,
                    shipmentFeeByTotal: true,
                },
                warehouseId: order.warehouseId,
            };

            await storeApi.createOrder({
                storeId: store._id,
                token: token.accessToken,
                data,
            });

            setSubmit(false);
            message.success('Đã tạo đơn thành công');
            if (isEmpty(customerObjectId)) {
                const dataCustomer = {
                    ...order.customer,
                    fbPageId: store.activePage._id,
                    fbUserId: conversation.fbUserId,
                };
                const newCustomer = await storeApi.createCustomer({
                    token: token.accessToken,
                    storeId: store._id,
                    data: dataCustomer,
                });
                setCustomerObjectId(newCustomer._id);
            }
            toggleDone();
        } catch (error) {
            setSubmit(false);
            if (get(error, 'response.data.message') === 'INVALID_PRODUCTS_QUANTITY') {
                message.error(
                    'Sản phẩm được chọn có thể không tồn tại hoặc không đủ số lượng ở kho lấy hàng mà bạn đã chọn',
                );
            } else {
                message.error('Lỗi tạo đơn');
            }
        }
    };

    const notValidDelivery = () => {
        const hasSelectDelivery =
            order.deliveryOptions.serviceId && order.deliveryOptions.serviceId !== 0;

        // if(!hasSelectDelivery) return true;

        if (
            (hasSelectDelivery && !order.deliveryOptions.transportType) ||
            (hasSelectDelivery && typeof order.deliveryOptions.noteForDelivery === 'undefined')
        ) {
            return true;
        }

        return false;
    };

    const checkValid = () => {
        if (
            order.customer.name.length === 0 ||
            order.customer.phoneNo.length === 0 ||
            typeof order.customer.province === 'undefined' ||
            typeof order.customer.district === 'undefined' ||
            typeof order.customer.ward === 'undefined' ||
            typeof order.warehouseId === 'undefined' ||
            order.products.length === 0 ||
            notValidDelivery() ||
            hiddenModalExpired
        )
            return false;

        return true;
    };

    if (done) {
        return <OrderDone toggleDone={toggleDone} />;
    }

    return (
        <div className='order-tab'>
            <div className='order-tab-content'>
                <div className='tab-content-inner' style={{ paddingTop: 5 }}>
                    <Space direction='vertical' size={20} style={{ width: '100%' }}>
                       <div>
                           <OrderCustomerInfo />
                           <Divider />
                           <OrderStore />
                           <Divider />
                           <SearchProduct />
                           <OrderProductList />
                           <AddProduct />
                       </div>
                       <OrderTransport />
                    </Space>
                </div>
            </div>

            <div className='order-tab-bottom'>
                <Button
                    type='primary'
                    htmlType='submit'
                    loading={submit}
                    disabled={!checkValid()}
                    icon={<SaveOutlined />}
                    onClick={saveOrder}
                    style={{ height: 35 }}
                >
                    Lưu
                </Button>
            </div>
        </div>
    );
};

export default OrderTab;
