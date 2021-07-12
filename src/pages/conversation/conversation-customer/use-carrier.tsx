import { Col, Form, Input, InputNumber, Row, Select } from 'antd';
import React, { FC } from 'react';
import formatMoney, { formatterInput, parserInput } from '../../../utils/format-money';
import { useOrder } from './context-order';
import { getFee } from './util';

const FormItem = Form.Item;
const style = { margin: '0 0 10px' };

const UseCarrier: FC = (): JSX.Element => {
    const { order, setOrder } = useOrder();

    const changePbk = (value: any) => {
        setOrder({
            ...order,
            deliveryOptions: {
                ...order.deliveryOptions,
                shipmentFeeForCustomer: value,
            },
        });
    };

    const changeCkType = (discountBy: number) => {
        setOrder({
            ...order,
            deliveryOptions: { ...order.deliveryOptions, discountBy },
        });
    };

    const changeValueCk = (value: any) => {
        if (typeof value === 'number') {
            setOrder({
                ...order,
                deliveryOptions: { ...order.deliveryOptions, discount: value },
            });
        }
    };

    const changeNoteKh = (e: any) => {
        const customerNote = e.target.value;
        setOrder({
            ...order,
            deliveryOptions: { ...order.deliveryOptions, customerNote },
        });
    };
    const changeNoteCskh = (e: any) => {
        const noteForCustomerCare = e.target.value;

        setOrder({
            ...order,
            deliveryOptions: { ...order.deliveryOptions, noteForCustomerCare },
        });
    };

    const { feeForReceiver, moneyForSender } = getFee(order);

    return (
        <Row gutter={20}>
            <Col span={12}>
                <FormItem label='Phí vận chuyển' style={{ ...style }} labelCol={{ span: 24 }}>
                    <InputNumber
                        formatter={formatterInput}
                        parser={parserInput}
                        disabled
                        value={order.deliveryOptions.shipmentFee}
                        style={{ width: '100%' }}
                        onChange={() => {}}
                    />
                </FormItem>
            </Col>
            <Col span={12}>
                <FormItem label='Phí báo khách' style={{ ...style }} labelCol={{ span: 24 }}>
                    <InputNumber
                        value={order.deliveryOptions.shipmentFeeForCustomer}
                        formatter={formatterInput}
                        parser={parserInput}
                        style={{ width: '100%' }}
                        onChange={changePbk}
                    />
                </FormItem>
            </Col>

            <Col span={24}>
                <FormItem label='Ghi chú của khách' style={{ ...style }} labelCol={{ span: 24 }}>
                    <Input.TextArea onChange={changeNoteKh} style={{ width: '100%' }} />
                </FormItem>
            </Col>
            <Col span={24}>
                <FormItem label='Ghi chú CSKH' style={{ ...style }} labelCol={{ span: 24 }}>
                    <Input.TextArea onChange={changeNoteCskh} style={{ width: '100%' }} />
                </FormItem>
            </Col>

            <Col span={12}>
                <FormItem label='Chiết khấu' style={{ ...style }} labelCol={{ span: 24 }}>
                    <Input.Group compact>
                        <Select defaultValue={0} onChange={changeCkType}>
                            <Select.Option value={0}>đ</Select.Option>
                            <Select.Option value={1}>%</Select.Option>
                        </Select>
                        {order.deliveryOptions.discountBy === 1 ? (
                            <InputNumber
                                max={100}
                                min={0}
                                onChange={changeValueCk}
                                style={{ width: '60%' }}
                            />
                        ) : (
                            <InputNumber
                                formatter={formatterInput}
                                parser={parserInput}
                                min={0}
                                onChange={changeValueCk}
                                style={{ width: '60%' }}
                            />
                        )}
                    </Input.Group>
                </FormItem>
            </Col>

            <Col span={12}>
                <div style={{ color: '#101025' }}>
                    <Row gutter={[5, 5]}>
                        <Col span={24}>Thu người nhận:</Col>
                        <Col span={24} style={{ color: '#0872d7' }}>
                            {formatMoney(feeForReceiver)}đ
                        </Col>
                    </Row>
                    <Row gutter={[5, 5]}>
                        <Col span={24}>Trả người gửi:</Col>
                        <Col span={24} style={{ color: '#0872d7' }}>
                            {formatMoney(moneyForSender)}đ
                        </Col>
                    </Row>
                </div>
            </Col>
        </Row>
    );
};

export default UseCarrier;
