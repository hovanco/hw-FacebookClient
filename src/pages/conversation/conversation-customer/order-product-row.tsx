import { PictureOutlined } from '@ant-design/icons';
import { Avatar, Col, InputNumber, Row } from 'antd';
import React, { FC, memo } from 'react';
import { CloseIcon } from '../../../assets/icon';
import { formatterInput, parserInput } from '../../../utils/format-money';
import { TextEllipsis } from '../../../components';
import { IMG_URL } from '../../../configs/vars';

interface OrderProductRowProps {
    product: any;
    removeOrderProduct: (productId: string) => void;
    changeCount: ({ productId, count }: { productId: string; count: number }) => void;
}

const OrderProductRow: FC<OrderProductRowProps> = ({
    product,
    removeOrderProduct,
    changeCount,
}) => {
    const handleClick = () => {
        removeOrderProduct(product.productId);
    };

    const handleChangeCount = (value: any) => {
        changeCount({ productId: product.productId, count: Number(value) });
    };

    return (
        <div className='order-products-row'>
            <Row gutter={10} align='middle'>
                <Col style={{ flexShrink: 0 }}>
                    {product.images && product.images.length > 0 ? (
                        <Avatar shape='square' size={57} src={`${IMG_URL}${product.images[0]}`} />
                    ) : (
                        <Avatar shape='square' size={57} icon={<PictureOutlined />} />
                    )}
                </Col>

                <Col style={{ flex: 1 }}>
                    <div className='product-name'>
                        <TextEllipsis width={'100%'}>{product.name}</TextEllipsis>
                    </div>

                    <Row align='middle' justify='space-between' gutter={5}>
                        <Col>
                            <InputNumber
                                value={product.price}
                                formatter={formatterInput}
                                parser={parserInput}
                                min={0}
                                disabled
                            />{' '}
                            đ
                        </Col>
                        <Col>
                            x{' '}
                            <InputNumber
                                value={product.count}
                                style={{ width: 50 }}
                                min={1}
                                onChange={handleChangeCount}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col style={{ flexShrink: 0 }}>
                    <span className='remove'>
                        <CloseIcon onClick={handleClick} />
                    </span>
                </Col>
            </Row>
        </div>
    );
};

export default memo(OrderProductRow);
