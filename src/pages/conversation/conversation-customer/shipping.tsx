import { Checkbox, Col, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { compact, flatten, pick } from 'lodash';
import React, { FC, memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import shippingApi from '../../../api/shipping-api';
import { Loading } from '../../../components';
import { API_URI } from '../../../configs/vars';
import formatMoney from '../../../utils/format-money';
import NoteForDelivery from '../../order-detail/note-for-delivery';
import { useOrder } from './context-order';
import './shipping.less';

export interface IService {
    id: string;
    name: string;
    ServiceID: string;
    shiper: {
        id: string;
    };
    price: number;
}

const Shipping: FC = (): JSX.Element => {
    const { order, setOrder } = useOrder();
    const [loading, setLoading] = useState(false);

    const store = useSelector((state: any) => state.store.store);
    const token = useSelector((state: any) => state.auth.token);
    const [ships, setShips] = useState<any>(null);

    const changeNoteForDelivery = (noteForDelivery: string) => {
        const newOrder = {
            ...order,
            deliveryOptions: {
                ...order.deliveryOptions,
                noteForDelivery,
            },
        };
        setOrder(newOrder);
    };

    useEffect(() => {
        async function loadShipping() {
            setLoading(true);
            try {
                const response = await shippingApi.servicesTransport({
                    storeId: store._id,
                    token: token.accessToken,
                    data: {
                        toProvinceId: order.customer.province,
                        toDistrictId: order.customer.district,
                        toWardId: order.customer.ward,
                        warehouseId: order.warehouseId,
                        weight: order.products.reduce(
                            (value: number, o: any) => o.weight * o.count + value,
                            0
                        ),
                        length: 20,
                        width: 20,
                        height: 10,
                    },
                });
                setShips(response);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }

        const valid =
            order.customer.province &&
            order.customer.district &&
            order.customer.ward &&
            order.warehouseId &&
            order.products.length > 0;

        if (valid) {
            loadShipping();
        }
    }, [
        order.customer.province,
        order.customer.district,
        order.customer.ward,
        order.products,
        order.warehouseId,
    ]);

    function handleUpdateShip(service: any) {
        setOrder({
            ...order,
            shiper: service,
            phi_van_chuyen: service ? service.price : 0,
            order_type: 'use_carrier',
        });
    }

    if (loading)
        return (
            <div className='ships'>
                <Loading />
            </div>
        );

    if (!ships) return <div />;

    const formatShips = ships.map((ship: any) => {
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

    const mergeShipArr = flatten(formatShips).map((s: any, i: number) => ({
        ...s,
        key: i,
    }));

    return (
        <>
            <div className='ships'>
                {mergeShipArr.map((ship: any) => {
                    const selectShip = () => {
                        const newOrder = {
                            ...order,
                            deliveryOptions: {
                                ...order.deliveryOptions,
                                ...pick(ship, ['serviceId', 'transportType', 'shipmentFee']),
                            },
                        };

                        setOrder(newOrder);
                    };

                    const checked =
                        order.deliveryOptions.serviceId == ship.serviceId &&
                        order.deliveryOptions.transportType == ship.transportType;

                    return (
                        <div key={ship.key} className='ship' onClick={selectShip}>
                            <Row gutter={5} justify='space-between' align='middle'>
                                <Col span={3}>
                                    <Checkbox checked={checked}></Checkbox>
                                </Col>
                                <Col span={9}>
                                    <img
                                        src={`${API_URI}/store${ship.avatar}`}
                                        style={{ width: 80 }}
                                    />
                                </Col>
                                <Col span={5}>
                                    {ship.transportType == 1
                                        ? 'Nhanh'
                                        : ship.transportType == 2
                                        ? 'Tiêu chuẩn'
                                        : ''}
                                </Col>
                                <Col span={7} style={{ textAlign: 'right' }}>
                                    {formatMoney(ship.shipmentFee)}đ
                                </Col>
                            </Row>
                        </div>
                    );
                })}
            </div>

            <FormItem label='Ghi chú'>
                <NoteForDelivery
                    changeNoteForDelivery={changeNoteForDelivery}
                    noteForDelivery={order.deliveryOptions.noteForDelivery}
                />
            </FormItem>
        </>
    );
};

export default memo(Shipping);
