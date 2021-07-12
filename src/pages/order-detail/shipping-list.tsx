import { Button, Checkbox, Table } from 'antd';
import { compact, flatten, pick } from 'lodash';
import React, { FC, memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import shippingApi from '../../api/shipping-api';
import { API_URI } from '../../configs/vars';
import formatMoney from '../../utils/format-money';

export interface IService {
    id: string;
    name: string;
    ServiceID: string;
    shiper: {
        id: string;
    };
    price: number;
}

interface Props {
    order: any;
    changeShip: (order: any) => void;
    disabled?: boolean;
    edit?: boolean;
    updateIsEditShip: () => void;
}

const formatShips = (ships: any[]) =>
    ships.map((ship: any) => {
        const { info, shipmentFees } = ship;

        const ship_items = shipmentFees.map((s: any) => ({
            avatar: info.avatar,
            serviceId: info.id,
            transportType: s.transportType,
            shipmentFee: s.total,
            name: info.name,
        }));

        return compact(ship_items);
    });

const Shipping: FC<Props> = ({
    order,
    changeShip,
    edit = false,
    disabled = false,
    updateIsEditShip,
}): JSX.Element => {
    const [loading, setLoading] = useState(false);

    const store = useSelector((state: any) => state.store.store);
    const token = useSelector((state: any) => state.auth.token);
    const [ships, setShips] = useState<any>([]);

    const loadShipping = async () => {
        setLoading(true);
        try {
            const response = await shippingApi.servicesTransport({
                storeId: store._id,
                token: token.accessToken,
                data: {
                    toProvinceId: order.customer.province,
                    toDistrictId: order.customer.district,
                    toWardId: order.customer.ward,
                    warehouseId: order.warehouseId._id,
                    weight: order.products.reduce(
                        (value: number, o: any) => o.productId.weight * o.count + value,
                        0
                    ),
                    length: 20,
                    width: 20,
                    height: 10,
                },
            });

            const format_ships = formatShips(response);

            const res_ships = flatten(format_ships).map((s: any, i: number) => ({
                ...s,
                key: i,
            }));

            setShips(res_ships);

            const ship_exist = res_ships.find(
                (ship: any) =>
                    order.deliveryOptions.serviceId == ship.serviceId &&
                    order.deliveryOptions.transportType == ship.transportType
            );

            if (ship_exist) {
                const shipmentFeeForCustomer =
                    !order.deliveryOptions.shipmentFeeForCustomer ||
                    ship_exist.shipmentFee > order.deliveryOptions.shipmentFeeForCustomer
                        ? 0
                        : order.deliveryOptions.shipmentFeeForCustomer;

                const newOrder = {
                    ...order,

                    deliveryOptions: {
                        ...order.deliveryOptions,
                        ...pick(ship_exist, ['serviceId', 'transportType', 'shipmentFee']),
                        shipmentFeeForCustomer,
                    },
                };

                changeShip(newOrder);
            }

            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const updateFeeShip = () => {
        const valid =
            order.customer.province &&
            order.customer.district &&
            order.customer.ward &&
            order.warehouseId &&
            order.products.length > 0;

        if (valid) {
            updateIsEditShip();
            loadShipping();
        }
    };

    useEffect(() => {
        const valid =
            order.customer.province &&
            order.customer.district &&
            order.customer.ward &&
            order.warehouseId &&
            order.products.length > 0;

        if (valid) {
            loadShipping();
        }
    }, []);

    const columns = [
        {
            title: '',
            dataIndex: '',
            key: 'x',
            render: (ship: any) => {
                const checked =
                    order.deliveryOptions.serviceId == ship.serviceId &&
                    order.deliveryOptions.transportType == ship.transportType;
                return <Checkbox style={{ margin: 0 }} checked={checked} disabled={disabled} />;
            },
        },
        {
            title: 'Hãng',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (avatar: string) => {
                return <img src={`${API_URI}/store${avatar}`} style={{ width: 100 }} />;
            },
        },
        {
            title: 'Gói',
            dataIndex: 'transportType',
            key: 'transportType',
            render: (transportType: any) => {
                if (transportType == 1) return 'Nhanh';
                if (transportType == 2) return 'Tiêu chuẩn';

                return '';
            },
        },
        {
            title: 'Giá',
            dataIndex: 'shipmentFee',
            key: 'shipmentFee',
            render: (shipmentFee: any) => {
                return formatMoney(shipmentFee);
            },
        },
    ];

    const disableBtn =
        !order.customer.province || !order.customer.district || !order.customer.ward || !edit;

    return (
        <>
            <Table
                loading={loading}
                size='small'
                onRow={(ship) => {
                    return {
                        onClick: () => {
                            if (disabled) return;
                            if (order.deliveryOptions.serviceId !== 0) {
                                const shipmentFeeForCustomer =
                                    !order.deliveryOptions.shipmentFeeForCustomer ||
                                    ship.shipmentFee > order.deliveryOptions.shipmentFeeForCustomer
                                        ? 0
                                        : order.deliveryOptions.shipmentFeeForCustomer;

                                const newOrder = {
                                    ...order,

                                    deliveryOptions: {
                                        ...order.deliveryOptions,
                                        ...pick(ship, [
                                            'serviceId',
                                            'transportType',
                                            'shipmentFee',
                                        ]),
                                        shipmentFeeForCustomer,
                                    },
                                };

                                changeShip(newOrder);
                            }
                        },
                    };
                }}
                style={{ marginBottom: 20 }}
                columns={columns}
                bordered
                dataSource={ships}
                pagination={false}
            />
            <div style={{ textAlign: 'right' }}>
                <Button onClick={updateFeeShip} type='primary' size='small' disabled={disableBtn}>
                    Tính lại phí vận chuyển
                </Button>
            </div>
        </>
    );
};

export default memo(Shipping);
