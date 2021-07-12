import { ExclamationCircleOutlined, SaveOutlined } from '@ant-design/icons';
import {
    Button,
    Card,
    Col,
    Divider,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Row,
    Tag,
    Select,
} from 'antd';
import { get, isNull, pick, omit, isEqual } from 'lodash';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateOrder } from '../../api/order-api';
import shippingApi from '../../api/shipping-api';
import ChangeStatus from '../orders/change-status';
import { statusDelivery } from '../orders/data';
import AddProduct from './add-product';
import { useOrderDetail } from './context';
import CreateShipOrder from './create-ship-order';
import Discount from './discount';
import NoteForDelivery from './note-for-delivery';
import OrderAddress from './order-address';
import SelectOptionDelivery from './select-option-delivery';
import ShippingList from './shipping-list';
import TableOrderList from './table-order-list';
import TotalOrder from './total-order';
import { ships } from './var';
import { formatterInput, parserInput } from '../../utils/format-money';
import { validatePhone } from '../../utils/validate-phone';
import { fetchWarehouses } from '../../reducers/warehouseState/warehouseAction';
import { getFee } from '../conversation/conversation-customer/util';
import './form-update-order.less';

interface Props {}

export const formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
};
const formItemLayout1 = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const LIMIT = 20;

export const style = { marginBottom: 5 };

const FormUpdateOrder = (props: Props): JSX.Element => {
    const [isEdit, setIsEdit] = useState(false);
    const [isEditShip, setIsEditShip] = useState(false);
    const [loading, setLoading] = useState(false);
    const [disabledUpdate, setDisabledUpdate] = useState(false);
    const [loading_create_ship, setLoadingCreateShip] = useState(false);
    const { order, changeOrder } = useOrderDetail();
    const [order_local, setOrderLocal] = useState<any>(order);
    const token = useSelector((state: any) => state.auth.token);
    const store = useSelector((state: any) => state.store.store);
    const [formOrderDetail] = Form.useForm();

    const updateIsEdit = (bool: boolean) => {
        setIsEdit(bool);
    };

    const handleUpdateOrder = (order_res: any) => {
        setOrderLocal(order_res);
        updateIsEdit(true);
    };

    const changeAddress = (order_res: any) => {
        setIsEditShip(true);
        handleUpdateOrder(order_res);
    };

    const onChangeDeliveryOptions = (e: any) => {
        const deliveryOptions = {
            ...order_local.deliveryOptions,
            [e.target.name]: e.target.value,
        };

        handleUpdateOrder({
            ...order_local,
            deliveryOptions,
        });
    };

    const handleRemoveProduct = (productId: any) => {
        const newProducts = order_local.products.filter(
            (product: any) => product.productId._id !== productId
        );
        const newOrder = { ...order_local, products: newProducts };
        handleUpdateOrder(newOrder);
        changeOrder(newOrder);
        updateIsEdit(true);
        setIsEditShip(true);
    };

    const changeCustomer = (e: any) => {
        handleUpdateOrder({
            ...order_local,
            customer: {
                ...order_local.customer,
                [e.target.name]: e.target.value,
            },
        });
    };

    const updateProduct = (products: any) => {
        handleUpdateOrder({
            ...order_local,
            products,
        });
        setIsEditShip(true);
    };

    const changeDiscount = ({ discount, discountBy }: { discount: number; discountBy: number }) => {
        const deliveryOptions = {
            ...order_local.deliveryOptions,
            discount,
            discountBy,
        };
        handleUpdateOrder({
            ...order_local,
            deliveryOptions,
        });
    };

    const changeShipmentFee = (shipmentFee: any) => {
        const deliveryOptions = {
            ...order_local.deliveryOptions,
            shipmentFee,
        };
        handleUpdateOrder({
            ...order_local,
            deliveryOptions,
        });
    };

    const changeShipmentFeeForCustomer = (shipmentFeeForCustomer: any) => {
        const deliveryOptions = {
            ...order_local.deliveryOptions,
            shipmentFeeForCustomer,
        };
        handleUpdateOrder({
            ...order_local,
            deliveryOptions,
        });
    };

    const changeNoteForDelivery = (noteForDelivery: string) => {
        const newOrder = {
            ...order_local,
            deliveryOptions: {
                ...order_local.deliveryOptions,
                noteForDelivery,
            },
        };
        handleUpdateOrder(newOrder);
    };

    const [warehouseId, setWarehouseId] = useState<string | undefined>(
        order_local
            ? (order_local as any).warehouseId && (order_local as any).warehouseId._id
            : undefined
    );
    const [dataWarehouse, setDataWarehouse] = useState<any[]>([]);
    const warehouses = useSelector(
        ({ warehouse }: { warehouse: any }) => warehouse.warehouses.data
    );
    const total = useSelector(({ warehouse }: { warehouse: any }) => warehouse.warehouses.total);
    const [page, setPage] = useState(1);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchWarehouses({ page: 1, limit: LIMIT }));
        setDataWarehouse(warehouses);
    }, []);

    useEffect(() => {
        if (warehouses) {
            page === 1
                ? setDataWarehouse(warehouses)
                : setDataWarehouse(dataWarehouse.concat(warehouses));
        }
    }, [warehouses]);

    const handleSelectWarehouse = (warehouseId: string) => {
        setWarehouseId(warehouseId);
        const data = dataWarehouse.find((w: any) => w._id === warehouseId);
        const newOrder = {
            ...(order_local as any),
            warehouseId: data,
        };
        handleUpdateOrder(newOrder);
    };

    const handleScroll = (e: any) => {
        const maxPage = Math.ceil(total / LIMIT);
        const element = e.target;
        if (
            element.scrollHeight === element.clientHeight + element.scrollTop &&
            page + 1 <= maxPage
        ) {
            setPage(page + 1);
            dispatch(fetchWarehouses({ page: page + 1, limit: LIMIT }));
        }
    };

    const saveOrder = async ({ showMessage = true }: { showMessage?: boolean }) => {
        setLoading(true);
        const products = order_local.products.map((p: any) => {
            return {
                count: p.count,
                productId: p.productId._id,
                price: p.price,
            };
        });
        const { feeForReceiver } = getFee(order_local);

        try {
            const deliveryOptions = {
                ...pick(order_local.deliveryOptions, [
                    'discount',
                    'discountBy',
                    'serviceId',
                    'shipmentFee',
                    'shipmentFeeByTotal',
                    'shipmentFeeForCustomer',
                    'transportType',
                    'customerNote',
                    'noteForCustomerCare',
                    'noteForDelivery',
                ]),
                feeForReceiver,
                shipmentOrderId: order_local.deliveryOptions.shipmentOrderId
                    ? order_local.deliveryOptions.shipmentOrderId
                    : undefined,
            };

            let data: any = {
                customer: omit(order_local.customer, [
                    '_id',
                    'fbUserId',
                    'provinceName',
                    'districtName',
                    'wardName',
                ]),
                deliveryOptions,
                products,
                warehouseId: order_local.warehouseId._id,
            };

            if (order_local.isDraft) {
                data.isDraft = false;
            }

            const response = await updateOrder({
                token: token.accessToken,
                storeId: store._id,
                orderId: order_local._id,
                data,
            });

            if (showMessage) {
                message.success('Đã cập nhật đơn hàng');
            }
            if (isEdit) {
                setIsEdit(false);
            }

            setLoading(false);

            return response;
        } catch (error) {
            message.error('Lỗi cập nhật đơn hàng');
            setLoading(false);

            return undefined;
        }
    };

    const handleToggleOrderShip = async () => {
        setLoadingCreateShip(true);
        const cancel = order_local.deliveryOptions.shipmentOrderId;

        const message_text = {
            success: `Đã ${cancel ? 'hủy' : 'tạo'} đơn hàng`,
            error: `Lỗi  ${cancel ? 'hủy' : 'tạo'} đơn hàng`,
        };

        try {
            const response = await shippingApi.toggleCreateOrderShip({
                token: token.accessToken,
                storeId: store._id,
                orderId: order_local._id,
                cancel,
                warehouseId: order_local.warehouseId._id,
            });

            setOrderLocal({
                ...order_local,
                status: response.status,
                deliveryOptions: {
                    ...response.deliveryOptions,
                },
            });
            setLoadingCreateShip(false);
            message.success(message_text.success);
        } catch (error) {
            setLoadingCreateShip(false);
            message.error(message_text.error);
        }
    };

    const handleAddProduct = (data: any) => {
        handleUpdateOrder(data);
        setIsEditShip(true);
    };

    const handleChangeShip = (data: any) => {
        if (!isEqual(order_local.deliveryOptions, data.deliveryOptions)) {
            handleUpdateOrder(data);
        }
    };

    const createOrderShip = () => {
        const totalWeight = order_local.products.reduce(
            (value: number, o: any) => o.productId.weight * o.count + value,
            0
        );

        let minWeight = order_local.deliveryOptions.serviceId == 1 ? 10 : 1;
        let maxWeight = order_local.deliveryOptions.serviceId == 1 ? 20000 : 1600000;

        if (totalWeight < minWeight) {
            message.error(`Tổng khối lượng của sản phẩm chưa đạt mức tối thiểu ${minWeight}g`);
            return;
        } else if (totalWeight > maxWeight) {
            message.error(`Tổng khối lượng của sản phẩm vượt mức tối đa ${maxWeight / 1000}kg`);
            return;
        }

        if (isEdit) {
            Modal.confirm({
                title: 'Đơn hàng chưa cập nhật',
                icon: <ExclamationCircleOutlined />,
                content: 'Bạn muốn tạo đơn vận chuyển với những cập nhật mới',
                okText: 'Tạo đơn',
                cancelText: 'Thoát',
                onOk: () => {
                    saveOrder({ showMessage: false }).then(() => {
                        handleToggleOrderShip();
                    });
                },
            });
        } else {
            handleToggleOrderShip();
        }
    };

    const cancelDelivery = () => {
        Modal.confirm({
            title: 'Hủy đơn vận chuyển',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn muốn hủy đơn vận chuyển',
            okText: 'Hủy đơn',
            cancelText: 'Thoát',
            onOk: handleToggleOrderShip,
        });
    };

    const renderShipLabel = () => {
        const { deliveryOptions } = order_local;

        if ((deliveryOptions as any).serviceId === 1) {
            return (
                <Tag
                    title={ships[1].label}
                    style={{
                        background: ships[1].color,
                        borderColor: ships[1].color,
                        color: '#fff',
                    }}
                >
                    {ships[1].label}
                </Tag>
            );
        }
        if ((deliveryOptions as any).serviceId === 2) {
            return (
                <Tag
                    title={ships[2].label}
                    style={{
                        background: ships[2].color,
                        borderColor: ships[2].color,
                        color: '#fff',
                    }}
                >
                    {ships[2].label}
                </Tag>
            );
        }

        return <Tag>TVC</Tag>;
    };

    const renderButtonCreateOrderShip = () => {
        const serviceId = get(order_local, 'deliveryOptions.serviceId');
        const shipmentOrderId = get(order_local, 'deliveryOptions.shipmentOrderId');

        if (isNull(serviceId) || typeof serviceId === 'undefined' || serviceId === 0) return null;

        if (order_local.status === 4) return null;

        return (
            <CreateShipOrder
                shipmentOrderId={shipmentOrderId}
                createOrderShip={createOrderShip}
                loading={loading_create_ship}
                disabled={
                    !order_local.deliveryOptions.noteForDelivery ||
                    !order_local.deliveryOptions.serviceId ||
                    disabledData ||
                    isEditShip
                }
            />
        );
    };

    const renderStatusDelivery = () => {
        const transportStatus: string = get(order_local, 'deliveryOptions.transportStatus');

        if (transportStatus) {
            const status = (statusDelivery as any)[transportStatus];

            if (!status) return;

            return (
                <Tag color='#87d068' style={{ marginLeft: 5 }}>
                    {status.title}
                </Tag>
            );
        }

        return;
    };

    const renderOrderDeliveryCancel = () => {
        const shipmentOrderId = get(order_local, 'deliveryOptions.shipmentOrderId');
        if (shipmentOrderId)
            return (
                <Tag
                    color='#f50'
                    style={{ marginLeft: 5, cursor: 'pointer' }}
                    onClick={cancelDelivery}
                >
                    Hủy đơn
                </Tag>
            );

        return null;
    };

    const disabled = !!order_local.deliveryOptions.shipmentOrderId;

    const disabledData =
        !order_local.customer.name ||
        !order_local.customer.phoneNo ||
        !order_local.customer.address ||
        !order_local.customer.province ||
        !order_local.customer.district ||
        !order_local.customer.ward ||
        order_local.products.length === 0;

    useEffect(() => {
        const optionDelivery = get(order_local, 'deliveryOptions.serviceId');
        if (optionDelivery !== 0) {
            setDisabledUpdate(
                disabled ||
                    disabledData ||
                    !order_local.deliveryOptions.noteForDelivery ||
                    !order_local.deliveryOptions.serviceId
            );
        } else {
            setDisabledUpdate(disabled || disabledData);
        }
    }, [order_local]);

    return (
        <Form form={formOrderDetail}>
            <Row gutter={30} style={{ padding: '0 15px 15px' }}>
                <Col md={16}>
                    <Card type='inner'>
                        <Row gutter={30}>
                            <Col span={12}>
                                <div className='title'>Khách hàng</div>
                                <Form.Item
                                    label='Tên'
                                    {...formItemLayout}
                                    style={style}
                                    rules={[{ required: true, message: 'Điền tên khách hàng' }]}
                                    initialValue={order_local.customer.name}
                                    name='name'
                                >
                                    <Input
                                        placeholder='Điền tên khách hàng'
                                        value={order_local.customer.name}
                                        name='name'
                                        onChange={changeCustomer}
                                        disabled={disabled}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label='Số ĐT'
                                    {...formItemLayout}
                                    style={style}
                                    name='phoneNo'
                                    rules={[
                                        { required: true, message: 'Điền số điện thoại' },
                                        {
                                            validator: validatePhone,
                                        },
                                    ]}
                                    initialValue={order_local.customer.phoneNo}
                                >
                                    <Input
                                        placeholder='Điền số điện thoại KH'
                                        value={order_local.customer.phoneNo}
                                        name='phoneNo'
                                        onChange={changeCustomer}
                                        disabled={disabled}
                                    />
                                </Form.Item>

                                <OrderAddress
                                    changeAddress={changeAddress}
                                    order={order_local}
                                    disabled={disabled}
                                />

                                <Form.Item
                                    label='Địa chỉ'
                                    {...formItemLayout}
                                    style={style}
                                    rules={[{ required: true, message: 'Điền địa chỉ' }]}
                                    name='address'
                                    initialValue={order_local.customer.address}
                                >
                                    <Input.TextArea
                                        name='address'
                                        value={order_local.customer.address}
                                        onChange={changeCustomer}
                                        disabled={disabled}
                                    />
                                </Form.Item>

                                <Form.Item label='Ghi chú KH' {...formItemLayout} style={style}>
                                    <Input.TextArea
                                        name='customerNote'
                                        onChange={onChangeDeliveryOptions}
                                        value={order_local.deliveryOptions.customerNote}
                                        disabled={disabled}
                                    />
                                </Form.Item>

                                <Form.Item label='Ghi chú CSKH' {...formItemLayout} style={style}>
                                    <Input.TextArea
                                        name='noteForCustomerCare'
                                        onChange={onChangeDeliveryOptions}
                                        value={order_local.deliveryOptions.noteForCustomerCare}
                                        disabled={disabled}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <div className='title'>Giao hàng</div>
                                <Form.Item style={{ marginBottom: 10 }}>
                                    <SelectOptionDelivery
                                        order={order_local}
                                        disabled={disabled}
                                        changeTypeDelivery={handleUpdateOrder}
                                    />
                                </Form.Item>

                                <Divider dashed style={{ margin: '10px 0' }} />

                                {order_local.deliveryOptions.serviceId !== 0 && (
                                    <>
                                        <Form.Item style={{ marginBottom: 10 }}>
                                            <Row justify='space-between' align='middle'>
                                                <Col>Hãng vận chuyển</Col>
                                                <Col>{renderButtonCreateOrderShip()}</Col>
                                            </Row>
                                        </Form.Item>
                                        <ShippingList
                                            disabled={disabled}
                                            order={order_local}
                                            changeShip={handleChangeShip}
                                            edit={isEditShip}
                                            updateIsEditShip={() => setIsEditShip(false)}
                                        />
                                        <Divider dashed style={{ margin: '15px 0' }} />
                                        <Form.Item
                                            label='Ghi chú'
                                            {...formItemLayout1}
                                            style={style}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Chọn ghi chú vận chuyển',
                                                },
                                            ]}
                                            name='noteForDelivery'
                                            initialValue={get(
                                                order_local,
                                                'deliveryOptions.noteForDelivery'
                                            )}
                                        >
                                            <NoteForDelivery
                                                noteForDelivery={get(
                                                    order_local,
                                                    'deliveryOptions.noteForDelivery'
                                                )}
                                                changeNoteForDelivery={changeNoteForDelivery}
                                                disabled={disabled}
                                            />
                                        </Form.Item>
                                    </>
                                )}

                                {/* {order_local.deliveryOptions.serviceId !== 0 &&
                                    order_local.customer.province &&
                                    order_local.customer.district &&
                                    order_local.customer.ward && (
                                        <>
                                            <Form.Item style={{ marginBottom: 10 }}>
                                                <Row justify='space-between' align='middle'>
                                                    <Col>Hãng vận chuyển</Col>
                                                    <Col>{renderButtonCreateOrderShip()}</Col>
                                                </Row>
                                            </Form.Item>
                                            <ShippingList
                                                disabled={disabled}
                                                order={order_local}
                                                changeShip={handleUpdateOrder}
                                            />
                                            <Divider dashed style={{ margin: '15px 0' }} />
                                            <Form.Item
                                                label='Ghi chú'
                                                {...formItemLayout1}
                                                style={style}
                                            >
                                                <NoteForDelivery
                                                    noteForDelivery={get(
                                                        order_local,
                                                        'deliveryOptions.noteForDelivery'
                                                    )}
                                                    changeNoteForDelivery={changeNoteForDelivery}
                                                    disabled={disabled}
                                                />
                                            </Form.Item>
                                        </>
                                    )} */}
                                <Form.Item
                                    label='Địa chỉ lấy hàng'
                                    {...formItemLayout1}
                                    style={style}
                                    rules={[{ required: true, message: 'Chọn địa chỉ lấy hàng' }]}
                                    name='warehouseId'
                                    initialValue={warehouseId}
                                >
                                    <Select
                                        onPopupScroll={handleScroll}
                                        onChange={handleSelectWarehouse}
                                        value={warehouseId}
                                        placeholder='Chọn địa chỉ lấy hàng'
                                        style={{ width: '100%' }}
                                        disabled={disabled}
                                    >
                                        {dataWarehouse.map((warehouse: any) => (
                                            <Select.Option
                                                key={warehouse._id}
                                                value={warehouse._id}
                                            >
                                                {warehouse.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Divider dashed style={{ margin: '10px 0' }} />
                            </Col>

                            <Col span={24}>
                                <Row
                                    align='middle'
                                    justify='space-between'
                                    style={{
                                        marginTop: 20,
                                        marginBottom: 15,
                                    }}
                                >
                                    <Col>
                                        <div className='title' style={{ margin: 0 }}>
                                            Sản phẩm
                                        </div>
                                    </Col>

                                    <Col>
                                        {!disabled && (
                                            <AddProduct
                                                order={order_local}
                                                changeProduct={handleAddProduct}
                                            />
                                        )}
                                    </Col>
                                </Row>

                                <Form.Item style={style}>
                                    <TableOrderList
                                        products={order_local.products}
                                        removeProduct={handleRemoveProduct}
                                        updateProduct={updateProduct}
                                        disabled={disabled}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Divider dashed style={{ margin: '10px 0' }} />
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col md={8}>
                    <Card type='inner' style={{ marginBottom: 15 }}>
                        <div className='title'>Trạng thái</div>
                        <Form.Item label='Đơn hàng' {...formItemLayout1} style={style}>
                            <ChangeStatus status={order_local.status} orderId={order_local._id} />
                        </Form.Item>
                        {order_local.code && (
                            <Form.Item label='Mã Đơn hàng' {...formItemLayout1} style={style}>
                                <Tag style={{ wordBreak: 'break-all' }}>{order_local.code}</Tag>
                            </Form.Item>
                        )}
                        <Form.Item label='Vận chuyển' {...formItemLayout1} style={style}>
                            {renderShipLabel()}
                            {renderStatusDelivery()}
                        </Form.Item>

                        {order_local.deliveryOptions &&
                            order_local.deliveryOptions.shipmentOrderId && (
                                <Form.Item label='Mã vận đơn' {...formItemLayout1} style={style}>
                                    <Tag style={{ wordBreak: 'break-all' }}>
                                        {order_local.deliveryOptions.shipmentOrderId}
                                    </Tag>
                                </Form.Item>
                            )}
                    </Card>

                    <Card type='inner' style={{ marginBottom: 15 }}>
                        <div className='title'>Thanh toán</div>

                        <Form.Item label='Chiết khấu' {...formItemLayout1} style={style}>
                            <Discount
                                discount={order_local.deliveryOptions.discount}
                                discountBy={order_local.deliveryOptions.discountBy}
                                changeDiscount={changeDiscount}
                                disabled={disabled}
                            />
                        </Form.Item>

                        <Form.Item label='Phí vận chuyển' {...formItemLayout1} style={style}>
                            <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                                value={order_local.deliveryOptions.shipmentFee}
                                onChange={changeShipmentFee}
                                disabled
                                formatter={formatterInput}
                                parser={parserInput}
                            />
                        </Form.Item>

                        <Form.Item label='Phí báo khách' {...formItemLayout1} style={style}>
                            <InputNumber
                                style={{ width: '100%' }}
                                min={0}
                                value={order_local.deliveryOptions.shipmentFeeForCustomer}
                                onChange={changeShipmentFeeForCustomer}
                                formatter={formatterInput}
                                parser={parserInput}
                                disabled={disabled}
                            />
                        </Form.Item>
                    </Card>

                    <TotalOrder order={order_local} />

                    <div style={{ marginTop: 15 }}>
                        <Button
                            type='primary'
                            icon={<SaveOutlined />}
                            onClick={() => saveOrder({ showMessage: true })}
                            loading={loading}
                            disabled={disabledUpdate}
                        >
                            Cập nhật
                        </Button>
                    </div>
                </Col>
            </Row>
        </Form>
    );
};

export default FormUpdateOrder;
