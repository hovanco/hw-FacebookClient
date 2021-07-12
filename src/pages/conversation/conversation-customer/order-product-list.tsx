import React, { memo } from 'react';
import { useOrder } from './context-order';
import OrderProductRow from './order-product-row';
import { Space, Row, Col } from 'antd';
import formatMoney from '../../../utils/format-money';

const OrderProductList = () => {
    const { order, setOrder } = useOrder();

    const removeOrderProduct = (productId: string) => {
        const newProducts = order.products.filter((p: any) => p.productId !== productId);
        setOrder({ ...order, products: newProducts });
    };

    const changeCount = ({ productId, count }: { productId: string; count: number }) => {
        const newProducts = order.products.map((p: any) => {
            if (p.productId === productId) return { ...p, count };
            return p;
        });

        setOrder({ ...order, products: newProducts });
    };

    if (order.products.length === 0) return <div />;

    return (
        <Space direction='vertical' size={5} style={{ width: '100%' }}>
            <div className='order-products'>
                {order.products.map((product: any) => {
                    return (
                        <OrderProductRow
                            key={product.productId}
                            product={product}
                            removeOrderProduct={removeOrderProduct}
                            changeCount={changeCount}
                        />
                    );
                })}
            </div>

            <div className='total-order-product'>
                <Row align='middle' justify='space-between'>
                    <Col>
                        Số lượng:{' '}
                        <span className='number'>
                            {order.products.reduce(
                                (number: number, product: any) => number + product.count,
                                0
                            )}
                        </span>
                    </Col>
                    <Col>
                        Tổng tiền:{' '}
                        <span className='number'>
                            {formatMoney(
                                order.products.reduce(
                                    (number: number, product: any) =>
                                        number + product.count * product.price,
                                    0
                                )
                            )}
                            đ
                        </span>
                    </Col>
                </Row>
            </div>
        </Space>
    );
};

export default memo(OrderProductList);
