import { FileImageOutlined } from '@ant-design/icons';
import { Avatar, Button, Checkbox, Modal, Table } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { fetchProductsRequest } from '../../../api/product-api';
import { IAuthState } from '../../../reducers/authState/authReducer';
import { IStoreState } from '../../../reducers/storeState/storeReducer';
import { useOrder } from './context-order';
import { IMG_URL } from '../../../configs/vars';

const LIMIT = 5;

const SearchProducts: FC = (): JSX.Element => {
    const token: any = useSelector(({ auth }: { auth: IAuthState }) => auth.token);
    const store = useSelector(({ store }: { store: IStoreState }) => store.store);

    const { order, setOrder } = useOrder();

    const [dataSource, setDataSource] = useState([]);
    const [visible, setVisible] = useState(false);
    const [pageProduct, setPageProduct] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const toggle = () => setVisible(!visible);

    useEffect(() => {
        if (visible) {
            handleFilter(pageProduct);
        }
    }, [visible]);

    const handleFilter = async (page: number) => {
        setLoading(true);
        const response = await fetchProductsRequest({
            token: token.accessToken,
            storeId: store._id,
            query: {
                page,
                limit: LIMIT,
            },
        });

        const dataSource = response.data.map((d: any) => ({
            ...d,
            key: d._id,
        }));

        setDataSource(dataSource);
        setTotal(response.total);
        setLoading(false);
    };

    const onChangePage = (page: number, pageSize?: number | undefined) => {
        setPageProduct(page);
        handleFilter(page);
    };

    const handleSelectProduct = (product: any) => {
        const exist = order.products.find((p: any) => p.productId === product._id);

        if (exist) {
            const newProducts = order.products.filter((p: any) => p.productId !== product._id);
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
                },
            ];

            const newOrder = { ...order, products: newProducts };
            setOrder(newOrder);
        }
    };

    return (
        <>
            <Button onClick={toggle}>Sản phẩm</Button>
            <Modal
                visible={visible}
                footer={null}
                title='Chọn sản phẩm'
                onOk={toggle}
                onCancel={toggle}
                bodyStyle={{ width: '700px' }}
                width='700'
                centered={true}
            >
                <Table
                    loading={loading}
                    dataSource={dataSource}
                    rowKey='_id'
                    columns={[
                        {
                            title: '',
                            dataIndex: '',
                            key: 'check',
                            render: ({ _id }: { _id: string }) => {
                                const product = order.products.find(
                                    (p: any) => p.productId === _id
                                );
                                const checked = !!product;
                                return <Checkbox checked={checked} />;
                            },
                        },
                        {
                            title: 'Hình ảnh',
                            dataIndex: 'images',
                            key: 'image',
                            render: (images) => {
                                if (images.length === 0)
                                    return (
                                        <Avatar
                                            icon={<FileImageOutlined />}
                                            size='large'
                                            shape='square'
                                        />
                                    );
                                return (
                                    <Avatar
                                        src={`${IMG_URL}${images[0]}`}
                                        size='large'
                                        shape='square'
                                    />
                                );
                            },
                        },
                        {
                            title: 'Tên',
                            dataIndex: 'name',
                            key: 'name',
                        },
                        {
                            title: 'Giá bán',
                            dataIndex: 'price',
                            key: 'price',
                            render: (price) => {
                                return `${price}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                            },
                        },

                        {
                            title: 'Khối lượng',
                            dataIndex: 'weight',
                            key: 'weight',
                        },
                    ]}
                    onRow={(product) => {
                        return {
                            onClick: () => {
                                handleSelectProduct(product);
                            },
                        };
                    }}
                    pagination={{
                        onChange: onChangePage,
                        current: pageProduct,
                        total,
                        pageSize: LIMIT,
                    }}
                />
            </Modal>
        </>
    );
};

export default SearchProducts;
