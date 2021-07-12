import { Col, Form, Input, InputNumber, Row, Select } from 'antd';
import React, { FC } from 'react';
import formatMoney, { formatterInput, parserInput } from '../../../utils/format-money';
import { IOrder } from './order-tab';

interface Props {
    order: IOrder;
    setOrder: Function;
}

const FormItem = Form.Item;
const style = { margin: '0 0 5px' };

const UseTransformer: FC<Props> = ({ order, setOrder }): JSX.Element => {
    const changePvc = (value: any) => {
        setOrder({ ...order, phi_van_chuyen: value });
    };

    const changePbk = (value: any) => setOrder({ ...order, phi_bao_khach: value });

    const changeCkType = (type: string) => {
        setOrder({ ...order, chiet_khau: { ...order.chiet_khau, type } });
    };

    const changeValueCk = (value: any) => {
        setOrder({ ...order, chiet_khau: { ...order.chiet_khau, value } });
    };

    const price_list_product = order.list_order.reduce(
        (number, d) => number + d.so_luong * d.price,
        0
    );
    const price_chiet_khau = (price: number) => {
        const { chiet_khau } = order;
        if (chiet_khau.type === 'percent') {
            return (price * chiet_khau.value) / 100;
        }
        return chiet_khau.value;
    };

    const paySender =
        price_list_product +
        order.phi_bao_khach -
        order.phi_van_chuyen -
        price_chiet_khau(price_list_product) -
        order.tien_chuyen_khoan -
        order.tien_coc;

    const collectingRecipient =
        price_list_product +
        order.phi_bao_khach -
        price_chiet_khau(price_list_product) -
        order.tien_chuyen_khoan -
        order.tien_coc;

    const changeCustomerNote = (e: any) => {
        setOrder({ ...order, customer_note: e.target.value });
    };
    const changeCskhNote = (e: any) => {
        setOrder({ ...order, cskh_note: e.target.value });
    };

    return (
        <Row gutter={10} style={{ padding: '0 10px' }}>
            <Col span={12}>
                <FormItem label='Phí vận chuyển' style={{ ...style }}>
                    <InputNumber
                        formatter={formatterInput}
                        parser={parserInput}
                        onChange={changePvc}
                        style={{ width: '100%' }}
                    />
                </FormItem>

                <FormItem label='Ghi chú của khách' style={{ ...style }}>
                    <Input.TextArea onChange={changeCustomerNote} />
                </FormItem>

                <FormItem label='Ghi chú CSKH' style={{ ...style }}>
                    <Input.TextArea onChange={changeCskhNote} />
                </FormItem>
            </Col>

            <Col span={12}>
                <FormItem label='Phí báo khách' style={{ ...style }}>
                    <InputNumber
                        formatter={formatterInput}
                        parser={parserInput}
                        onChange={changePbk}
                        style={{ width: '100%' }}
                    />
                </FormItem>

                <FormItem label='Chiết khấu' style={{ ...style }}>
                    <Select defaultValue='money' onChange={changeCkType}>
                        <Select.Option value='money'>Tiền</Select.Option>
                        <Select.Option value='percent'>%</Select.Option>
                    </Select>

                    {order.chiet_khau.type === 'percent' ? (
                        <InputNumber max={100} min={0} onChange={changeValueCk} />
                    ) : (
                        <InputNumber
                            formatter={formatterInput}
                            parser={parserInput}
                            onChange={changeValueCk}
                            min={0}
                        />
                    )}
                </FormItem>
                <div style={{ fontSize: 12, fontWeight: 700 }}>
                    <Row gutter={5} style={{ margin: '15px 0' }}>
                        <Col span={12}>Thu người nhận:</Col>
                        <Col span={12} style={{ textAlign: 'right', color: 'blue' }}>
                            {formatMoney(collectingRecipient)}
                        </Col>
                    </Row>
                    <Row gutter={5}>
                        <Col span={12}>Trả người gửi:</Col>
                        <Col span={12} style={{ textAlign: 'right', color: 'blue' }}>
                            {formatMoney(paySender)}
                        </Col>
                    </Row>
                </div>
            </Col>
        </Row>
    );
};

export default UseTransformer;
