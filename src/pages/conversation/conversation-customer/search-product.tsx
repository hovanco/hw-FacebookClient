import { PictureOutlined } from '@ant-design/icons';
import { Avatar, Col, Input, Row, Space, message } from 'antd';
import { debounce, flatten, get } from 'lodash';
import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchProductsRequest } from '../../../api/product-api';
import { SearchIcon } from '../../../assets/icon';
import { Loading } from '../../../components';
import { IMG_URL } from '../../../configs/vars';
import formatMoney from '../../../utils/format-money';
import { useOrder } from './context-order';
import './search-product.less';

interface ProductRowProps {
    product: any;
}

const ProductRow: FC<ProductRowProps> = ({ product }) => {
    const { order, setOrder } = useOrder();

    const outOfStock = !product.quantity || product.quantity === 0;

    const handleClick = () => {
        if (outOfStock) {
            return;
        }
        if (!order.warehouseId) {
            return message.error('Vui lòng chọn địa chỉ lấy hàng trước khi chọn sản phẩm!');
        }
        const exist = order.products.find((p: any) => p.productId === product._id);

        if (exist) {
            const newProducts = order.products.map((p: any) => {
                if (p.productId === product._id) return { ...p, count: p.count + 1 };
                return p;
            });

            const newOrder = { ...order, products: newProducts };

            setOrder(newOrder);
        } else {
            const newProducts = [
                ...order.products,
                {
                    name: product.name,
                    productId: product._id,
                    count: 1,
                    price: product.price,
                    weight: product.weight,
                    images: product.images,
                },
            ];

            const newOrder = { ...order, products: newProducts };
            setOrder(newOrder);
        }
    };

    const renderNameAttributes = () => {
        if (!product.attributes || product.attributes?.length === 0) {
            return null;
        }

        const attrNames = product.attributes.map((item: any) => get(item, 'tags'));

        return <small>{flatten(attrNames).join('-')}</small>;
    };


    return (
        <div
            className={outOfStock ? 'product-row disabled' : 'product-row'}
            onClick={handleClick}
        >
            <Row justify='space-between' align='middle' gutter={5}>
                <Col flex={3}>
                    <Space>
                        {product.images.length > 0 ? (
                            <Avatar
                                shape='square'
                                size={40}
                                src={`${IMG_URL}${product.images[0]}`}
                            />
                        ) : (
                            <Avatar shape='square' size={40} icon={<PictureOutlined />} />
                        )}

                        <div>
                            <div>{product.name}</div>

                            {renderNameAttributes()}
                        </div>
                    </Space>
                </Col>
                <Col flex={3} style={{ textAlign: 'center' }}>
                    <span className="quantity">
                        {product.quantity ? formatMoney(product.quantity) : 0}
                    </span>
                </Col>
                <Col>{formatMoney(product.price)} đ</Col>
            </Row>
        </div>
    );
};

interface ProductListProps {
    products: any[];
    loading: boolean;
}

const ProductsList: FC<ProductListProps> = ({ products, loading }) => {
    const renderContent = () => {
        if (loading)
            return (
                <div style={{ padding: 50 }}>
                    <Loading />
                </div>
            );

        if (products.length === 0) return <div>No products</div>;

        return products.map((product: any) => <ProductRow key={product._id} product={product} />);
    };

    return <div className='products-list'>{renderContent()}</div>;
};

const SearchProduct: FC = () => {
    const token = useSelector((state: any) => state.auth.token);
    const store = useSelector((state: any) => state.store.store);

    const { order } = useOrder();

    const [isFocus, setIsFocus] = useState(false);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<any[]>([]);

    const getProducts = async (textSearch?: string) => {
        try {
            setLoading(true);
            const res = await fetchProductsRequest({
                token: token.accessToken,
                storeId: store._id,
                query: {
                    textSearch,
                    page: 1,
                    limit: 15,
                    withQuantity: true,
                    warehouseId: order.warehouseId,
                },
            });

            setProducts(res.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const handleChange = (e: any) => {
        const text = e.target.value;
        if (text.length > 0) {
            searchProduct(text);
        }
    };

    const searchProduct = debounce((text: string) => {
        getProducts(text);
    }, 300);

    const handleFocus = async () => {
        setIsFocus(true);
        getProducts();
    };

    const handleBlur = () => {
        setTimeout(() => {
            setIsFocus(false);
        }, 300);
    };

    return (
        <div className='products-search'>
            <Input
                prefix={<SearchIcon />}
                placeholder='Tìm kiếm sản phẩm'
                allowClear
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className='input-search'
                style={{ height: 35 }}
            />

            {isFocus && <ProductsList products={products} loading={loading} />}
        </div>
    );
};

export default SearchProduct;
