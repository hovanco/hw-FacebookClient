import React, { useRef } from 'react';
import { Col, Row, Avatar, InputNumber, Input } from 'antd';
import { CloseCircleOutlined, PictureFilled } from '@ant-design/icons';
import formatMoney, { formatterInput, parserInput } from '../../../utils/format-money';
import { useNewLiveStream } from './context';
import EditKeyword from './edit-keyword';
import ProductItem from './product-item';
import { IMG_URL } from '../../../configs/vars';

const padding = '10px';
const borderRight = '1px solid #e0e0e0';

export const ListProducts = ({
    products,
    removeProduct,
    updateProduct,
    updateService,
    className = '',
}: {
    products: any;
    removeProduct: (id: string) => void;
    updateProduct: (id: string, price: number) => void;
    updateService: (id: string, propertyChanged: any) => void;
    className?: string;
}) => {
    const inputNumberRef = useRef<any>(null);

    return (
        <div style={{ border: '1px solid #eee' }} className={className}>
            <Row style={{ background: '#f0f0f0' }} justify='space-between'>
                <Col style={{ flex: 1 }}>
                    <Row className='product-table-head'>
                        <Col span={16} style={{ padding }}>
                            Sản phẩm
                        </Col>
                        <Col span={8} style={{ padding, textAlign: 'right' }}>
                            Đơn giá
                        </Col>
                    </Row>
                </Col>
            </Row>

            <div className='product-table-body'>
                {products.map((product: any) => {
                    let productData = product.productId ? product.productId : product;

                    return (
                        <Row align='stretch' key={productData._id} justify='space-between'>
                            <Col style={{ flex: 1 }}>
                                {productData.type === 'service' ? (
                                    <Row>
                                        <Col span={16} style={{ padding }} className='product-item'>
                                            <Input
                                                value={productData.name}
                                                placeholder='Tên dịch vụ khác'
                                                onChange={(event: any) =>
                                                    updateService(productData._id, {
                                                        name: event.target.value,
                                                    })
                                                }
                                            />
                                        </Col>
                                        <Col
                                            span={8}
                                            style={{ padding, margin: 'auto' }}
                                            className='product-item'
                                        >
                                            <InputNumber
                                                ref={inputNumberRef}
                                                value={product.price}
                                                formatter={formatterInput}
                                                parser={parserInput}
                                                min={0}
                                                onClick={() =>
                                                    inputNumberRef &&
                                                    inputNumberRef.current.select()
                                                }
                                                onChange={(value: any) =>
                                                    updateService(productData._id, { price: value })
                                                }
                                            />
                                            đ
                                            <CloseCircleOutlined
                                                onClick={() => removeProduct(productData._id)}
                                            />
                                        </Col>
                                    </Row>
                                ) : (
                                    <Row>
                                        <Col span={16} style={{ padding }} className='product-item'>
                                            <ProductItem product={productData} />
                                        </Col>
                                        <Col
                                            span={8}
                                            style={{ padding, margin: 'auto' }}
                                            className='product-item'
                                        >
                                            <InputNumber
                                                value={product.price}
                                                formatter={formatterInput}
                                                parser={parserInput}
                                                min={0}
                                                onChange={(value: any) =>
                                                    updateProduct(productData._id, value)
                                                }
                                            />
                                            đ
                                            <CloseCircleOutlined
                                                onClick={() => removeProduct(productData._id)}
                                            />
                                        </Col>
                                    </Row>
                                )}
                            </Col>
                        </Row>
                    );
                })}
            </div>
        </div>
    );
};

const KeywordItem = ({ keyword, keywordIndex }: { keyword: any; keywordIndex: number }) => {
    const { removeKeyword } = useNewLiveStream();

    const handleRemoveKeyword = () => {
        removeKeyword(keywordIndex);
    };

    return (
        <Row style={{ borderBottom: '1px solid #eee' }} align='stretch'>
            <Col span={7} style={{ textAlign: 'center', padding, borderRight }}>
                <div
                    style={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <EditKeyword keyword={keyword} keywordIndex={keywordIndex} />
                </div>
            </Col>
            <Col span={15}>
                {keyword.products.map((product: any) => {
                    let productData =
                        typeof product.productId === 'object' ? product.productId : product;

                    if (productData.type === 'service')
                        return (
                            <Row key={productData._id}>
                                <Col span={16} style={{ padding }}>
                                    {productData.name}
                                </Col>
                                <Col
                                    span={8}
                                    style={{
                                        padding,
                                        borderRight,
                                        alignItems: 'center',
                                        display: 'flex',
                                    }}
                                >
                                    {formatMoney(product.price)} đ
                                </Col>
                            </Row>
                        );

                    return (
                        <Row key={productData._id}>
                            <Col span={16} style={{ padding }}>
                                {!productData.images || productData.images.length === 0 ? (
                                    <Avatar
                                        size='large'
                                        icon={<PictureFilled />}
                                        shape='square'
                                        style={{ marginRight: 10, float: 'left' }}
                                    />
                                ) : (
                                    <Avatar
                                        size='large'
                                        src={`${IMG_URL}${productData.images[0]}`}
                                        shape='square'
                                        style={{ marginRight: 10, float: 'left' }}
                                    />
                                )}
                                {productData.name}
                            </Col>
                            <Col
                                span={8}
                                style={{
                                    padding,
                                    borderRight,
                                    alignItems: 'center',
                                    display: 'flex',
                                }}
                            >
                                {formatMoney(product.price)} đ
                            </Col>
                        </Row>
                    );
                })}
            </Col>
            <Col span={2} style={{ padding, textAlign: 'center' }}>
                <div
                    style={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <span onClick={handleRemoveKeyword}>
                        <CloseCircleOutlined />
                    </span>
                </div>
            </Col>
        </Row>
    );
};

interface Props {}

const ListKeyword = (props: Props) => {
    const { livestream } = useNewLiveStream();

    return (
        <div className='table-list-keyword'>
            <Row className='table-list-keyword-head'>
                <Col span={7} style={{ textAlign: 'center', padding, borderRight }}>
                    Từ khóa đặt hàng
                </Col>
                <Col span={15}>
                    <Row>
                        <Col span={16} style={{ padding }}>
                            Sản phẩm
                        </Col>
                        <Col span={8} style={{ padding, borderRight }}>
                            Đơn giá
                        </Col>
                    </Row>
                </Col>
                <Col span={2}></Col>
            </Row>

            {livestream.keywords.map((keyword: any, index: number) => {
                return <KeywordItem keyword={keyword} key={index} keywordIndex={index} />;
            })}
        </div>
    );
};

export default ListKeyword;
