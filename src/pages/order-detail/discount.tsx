import { Col, InputNumber, Row, Select } from 'antd';
import React, { FC } from 'react';
import { formatterInput, parserInput } from '../../utils/format-money';

interface Props {
    discountBy?: number;
    discount?: number;
    changeDiscount: (arg: any) => void;
    disabled?: boolean;
}

const Discount: FC<Props> = ({ discount, discountBy, changeDiscount, disabled }) => {
    const changeType = (value: string) => {
        changeDiscount({
            discountBy: parseInt(value),
            discount: 0,
        });
    };

    const changeValue = (val: any) => {
        changeDiscount({
            discountBy,
            discount: val,
        });
    };

    const max = discountBy === 1 ? 100 : undefined;

    return (
        <Row gutter={5}>
            <Col>
                <Select value={`${discountBy || '0'}`} onChange={changeType} disabled={disabled}>
                    <Select.Option value='1'>%</Select.Option>
                    <Select.Option value='0'>$</Select.Option>
                </Select>
            </Col>

            <Col>
                <InputNumber
                    disabled={disabled}
                    onChange={changeValue}
                    min={0}
                    value={discount}
                    max={max}
                    formatter={formatterInput}
                    parser={parserInput}
                />
            </Col>
        </Row>
    );
};

export default Discount;
