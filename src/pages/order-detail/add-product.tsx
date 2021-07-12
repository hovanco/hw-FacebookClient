import { FileImageOutlined, PlusOutlined } from '@ant-design/icons';
import { Avatar, Button, Checkbox, Modal, Table } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { fetchProductsRequest } from '../../api/product-api';
import useModal from '../../hooks/use-modal';
import { IMG_URL } from '../../configs/vars';

interface Props {
    order: any;
    changeProduct: (order: any) => void;
}

const LIMIT = 5;

const AddProuct: FC<Props> = ({ order, changeProduct }): JSX.Element => {
    const token: any = useSelector((state: any) => state.auth.token);
    const store = useSelector((state: any) => state.store.store);

    const { toggle, visible } = useModal();

    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageProduct, setPageProduct] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);

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

    const handleSelectProduct = (product: any) => {
        const exist = order.products.find((p: any) => p.productId._id === product._id);

        if (exist) {
            const products = order.products.filter((p: any) => p.productId._id !== product._id);
            const newOrder = { ...order, products };

            changeProduct(newOrder);
        } else {
            const newProduct = {
                count: 1,
                productId: {
                    ...product,
                },
                price: product.price,
            };

            const products = [...order.products, newProduct];
            const newOrder = { ...order, products };

            changeProduct(newOrder);
        }
    };

    const onChangePage = (page: number, pageSize?: number | undefined) => {
        setPageProduct(page);
        handleFilter(page);
    };

    useEffect(() => {
        if (visible) {
            handleFilter(pageProduct);
        }
    }, [visible]);

    return (
        <>
            <Button icon={<PlusOutlined />} onClick={toggle}>
                Sản phẩm
            </Button>

            <Modal
                visible={visible}
                footer={null}
                title='Thêm sản phẩm'
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
                                    (p: any) => p.productId._id === _id
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

export default AddProuct;
