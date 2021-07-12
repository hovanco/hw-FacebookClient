import { SearchOutlined } from '@ant-design/icons';
import { Input, Table } from 'antd';
import { debounce, pick } from 'lodash';
import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useSelector } from 'react-redux';
import { fetchProductsRequest } from '../../../api/product-api';
import { Loading } from '../../../components';
import formatMoney from '../../../utils/format-money';
import ProductItem from './product-item';

interface Props {
    setShowList: (value: boolean) => void;
    addProduct: (product: any) => void;
}

const LIMIT = 10;

const SearchProducts = (props: Props) => {
    const [page, setPage] = useState(1);

    const [text, setText] = useState('');
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasmore] = useState(true);
    const [products, setProducts] = useState<any[]>([]);
    const [total, setTotal] = useState(1);
    const token = useSelector((state: any) => state.auth.token);
    const store = useSelector((state: any) => state.store.store);

    const loadProducts = async ({
        textSearch,
        page,
        limit = LIMIT,
    }: {
        textSearch?: string;
        page: number;
        limit?: number;
    }) => {
        const res = await fetchProductsRequest({
            token: token.accessToken,
            storeId: store._id,
            query: {
                textSearch,
                page,
                limit,
            },
        });

        return res;
    };

    const onChange = async (e: any) => {
        const textSearch = e.target.value;
        setText(textSearch);

        handleSearchProduct(textSearch);
    };

    const handleSearchProduct = debounce(async (textSearch: string) => {
        setShow(true);
        props.setShowList(true);

        try {
            setLoading(true);

            const response = await loadProducts({
                textSearch,
                page: 1,
            });

            setProducts(response.data);
            setTotal(response.total);
            setLoading(false);
        } catch (error) {}
    }, 300);

    const onFocus = async () => {
        setShow(true);
        props.setShowList(true);
        try {
            setLoading(true);

            const response = await loadProducts({
                page: 1,
            });

            setProducts(response.data);
            setTotal(response.total);
            setLoading(false);
        } catch (error) {}
    };

    const onBlur = () => {
        setTimeout(() => {
            setShow(false);
            props.setShowList(false);
        }, 300);
    };

    const handleInfiniteOnLoad = async () => {
        const number = Math.ceil(total / LIMIT);

        if (number === page) {
            return;
        }

        const response = await loadProducts({
            textSearch: text,
            page: page + 1,
        });

        setProducts([...products, ...response.data]);
        setTotal(response.total);
        setPage(page + 1);
        setLoading(false);
    };

    const renderContent = () => {
        if (!show) return null;

        if (loading) return <Loading />;

        return (
            <>
                <div style={{ height: 215, overflow: 'auto' }}>
                    <InfiniteScroll
                        initialLoad={false}
                        pageStart={0}
                        loadMore={handleInfiniteOnLoad}
                        hasMore={!loading && hasMore}
                        threshold={20}
                        useWindow={false}
                    >
                        <Table
                            style={{ border: '1px solid #eee' }}
                            showHeader={false}
                            pagination={false}
                            columns={[
                                {
                                    title: 'Sản phẩm',
                                    dataIndex: '',
                                    key: 'product',
                                    render: (product: any) => {
                                        return (
                                            <div>
                                                <ProductItem product={product} />
                                            </div>
                                        );
                                    },
                                },
                                {
                                    title: 'Đơn giá',
                                    dataIndex: 'price',
                                    key: 'product',
                                    align: 'right',
                                    render: (price: any) => {
                                        return (
                                            <div className='secondary-paragraph'>
                                                {formatMoney(price)} đ
                                            </div>
                                        );
                                    },
                                },
                            ]}
                            dataSource={products}
                            onRow={(item) => {
                                return {
                                    onClick: () => {
                                        props.addProduct(
                                            pick(item, ['_id', 'name', 'price', 'images'])
                                        );
                                    },
                                };
                            }}
                            rowKey={(item: any) => item._id}
                        />
                    </InfiniteScroll>
                </div>
            </>
        );
    };
    return (
        <div style={{ position: 'relative' }}>
            <Input
                style={{ marginBottom: 30 }}
                prefix={<SearchOutlined />}
                placeholder='Tìm kiếm sản phẩm'
                size='large'
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={onChange}
            />

            <div>{renderContent()}</div>
        </div>
    );
};

export default SearchProducts;
