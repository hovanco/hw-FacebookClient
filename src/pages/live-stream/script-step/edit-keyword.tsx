import React, { useState, useEffect, useCallback } from 'react';
import { useNewLiveStream } from './context';
import useModal from '../../../hooks/use-modal';

import { size } from './index';
import { Button, Col, Divider, Empty, Input, Modal, Row, message } from 'antd';
import { ListProducts } from './list-keyword';
import SearchProducts from './search-products';
import AddProduct from './add-product';
import { EmptyProduct } from '../../../assets/icon';

import './add-keyword.less';

interface Props {
    keyword: {
        id: any;
        keyword: string;
        products: any[];
    };
    keywordIndex: number;
}

const EditKeyword = ({ keyword, keywordIndex }: Props) => {
    const [state, setState] = useState(keyword);
    const [show_list, setShowList] = useState(false);

    const { updateKeyword, removeKeyword, livestream } = useNewLiveStream();
    const { visible, toggle } = useModal();

    useEffect(() => {
        setState(keyword);
    }, [visible, keyword]);

    const validate = useCallback(() => {
        if (state.products.length === 0) {
            message.error('Bạn chưa chọn sản phẩm');
            return false;
        }

        if (state.keyword.length === 0) {
            message.error('Bạn chưa điền từ khóa');
            return false;
        }

        if (
            livestream.keywords
                .map((keywordItem: any) => keywordItem.keyword)
                .filter(
                    (keywordItem: any, index: number) =>
                        index !== keywordIndex && keywordItem === state.keyword
                ).length
        ) {
            message.error('Từ khoá đã tồn tại');
            return false;
        }

        return true;
    }, [state, livestream.keywords]);

    const handlechangeKeyword = (e: any) => {
        setState({
            ...state,
            keyword: e.target.value,
        });
    };

    const handleRemoveKeyword = () => {
        removeKeyword(keywordIndex);
        toggle();
    };

    const handleSaveEdit = () => {
        if (!validate()) return;

        updateKeyword(state, keywordIndex);
        toggle();
    };

    const addProduct = (product: any) => {
        if (
            state.products.filter((item: any) =>
                item.productId ? item.productId._id === product._id : item._id === product._id
            ).length
        ) {
            message.warning('Sản phẩm này đã được chọn');

            return;
        }

        const newProducts = [...state.products, product];

        setState({ ...state, products: newProducts });
    };

    const removeProduct = (productId: string) => {
        const newProducts = state.products.filter((product: any) => {
            let productData = product.productId ? product.productId : product;
            return productData._id !== productId;
        });

        setState({ ...state, products: newProducts });
    };

    const updateProduct = (productId: string, price: number) => {
        const newProducts = state.products.map((product: any) => {
            let productData = product.productId ? product.productId : product;

            if (productData._id === productId) {
                product.price = price;
            }
            return product;
        });
        setState({ ...state, products: newProducts });
    };

    const updateService = (productId: string, propertyChanged: any) => {
        const newProducts = state.products.map((product: any) => {
            let productData = product.productId ? product.productId : product;

            if (productData._id === productId) {
                return { ...product, ...propertyChanged };
            }
            return product;
        });
        setState({ ...state, products: newProducts });
    };

    const renderContent = () => {
        if (show_list) {
            return null;
        }

        if (state.products.length > 0) {
            return (
                <ListProducts
                    className='selected-product-table'
                    products={state.products}
                    removeProduct={removeProduct}
                    updateProduct={updateProduct}
                    updateService={updateService}
                />
            );
        }

        return (
            <Row justify='center' align='middle'>
                <Col md={18}>
                    <Empty
                        image={<EmptyProduct className='icon-empty-product' />}
                        description='Bạn chưa chọn sản phẩm nào. Vui lòng bấm vào ô tìm kiếm hoặc thêm mới sản phẩm để tạo từ khóa'
                    />
                </Col>
            </Row>
        );
    };

    return (
        <>
            <a onClick={toggle}>{state.keyword}</a>

            <Modal
                visible={visible}
                onCancel={toggle}
                title='Chỉnh sửa mẫu nội dung đặt hàng'
                footer={null}
                wrapClassName='modal-add-keyword'
            >
                <Row justify='space-between' align='middle' style={{ marginBottom: 10 }}>
                    <Col>
                        <span className='label_form'>Chọn sản phẩm</span>
                    </Col>

                    <Col>
                        <AddProduct addProduct={addProduct} />
                    </Col>
                </Row>

                <SearchProducts
                    setShowList={(value) => setShowList(value)}
                    addProduct={addProduct}
                />

                {renderContent()}

                <div style={{ marginTop: 20 }}>
                    <span className='label_form'>Từ khóa đặt hàng</span>
                    <br />
                    <Input
                        placeholder='Nhập từ khóa đặt hàng'
                        style={{ margin: '10px 0' }}
                        size={size}
                        onChange={handlechangeKeyword}
                        value={state.keyword}
                    />
                    <br />

                    <div>
                        Nếu bạn chọn sản phẩm là SON MAC thì nên đặt từ khóa tương ứng là “MAC”. Nếu
                        sản phẩm là tai nghe Airpod thì từ khóa đặt hàng nên là “AIRPOD”.
                    </div>
                </div>

                <Divider />

                <Row justify='space-between' align='middle'>
                    <Col>
                        <Button type='primary' danger onClick={handleRemoveKeyword}>
                            Xóa
                        </Button>
                    </Col>

                    <Col>
                        <Button onClick={toggle}>Hủy</Button>
                        <Button type='primary' style={{ marginLeft: 15 }} onClick={handleSaveEdit}>
                            Lưu lại
                        </Button>
                    </Col>
                </Row>
            </Modal>
        </>
    );
};

export default EditKeyword;
