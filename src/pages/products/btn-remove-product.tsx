import { DeleteOutlined } from '@ant-design/icons';
import { Button, message, Modal } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProductRequest } from '../../api/product-api';
import { fetchProducts } from '../../reducers/productState/productAction';

interface Props {
    products: string[];
    resetSelect: () => void;
    textSearch: string;
    limit: number;
    page: number;
}

const BtnRemoveProduct = ({ products, resetSelect, textSearch, limit, page }: Props) => {
    const dispatch = useDispatch();
    const store = useSelector((state: any) => state.store.store);
    const token = useSelector((state: any) => state.auth.token);

    const [loading, setLoading] = useState(false);

    const showDeleteConfirm = () => {
        Modal.confirm({
            title: 'Xóa sản phẩm?',
            content: `Bạn chắc chắn muốn xóa những sản phẩm đã chọn?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            width: 450,
            onOk() {
                removeMoreProducts();
            },
            onCancel() {},
        });
    };

    const removeMoreProducts = async () => {
        try {
            setLoading(true);

            const response = await Promise.all(
                products.map(async (productId: string) => {
                    await deleteProductRequest({
                        token: token.accessToken,
                        storeId: store._id,
                        productId,
                    });
                    return productId;
                })
            );

            message.success('Đã xóa sản phẩm');
            setLoading(false);
            resetSelect();
            dispatch(
                fetchProducts({
                    textSearch,
                    page,
                    limit,
                })
            );
        } catch (error) {
            if (error && error.response && error.response.data && error.response.data.message) {
                message.error(`${error.response.data.message}`);
            } else {
                message.error('Lỗi xóa sản phẩm');
            }
            dispatch(
                fetchProducts({
                    textSearch,
                    page,
                    limit,
                })
            );
            setLoading(false);
        }
    };

    return (
        <Button
            danger
            type='primary'
            icon={<DeleteOutlined />}
            onClick={showDeleteConfirm}
            loading={loading}
        >
            Xóa
        </Button>
    );
};

export default BtnRemoveProduct;
