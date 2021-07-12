import { Button, Col, Divider, Empty, Input, message, Modal, Row } from 'antd';
import React, { ReactElement, useCallback, useState } from 'react';
import { EmptyProduct } from '../../../assets/icon';
import useModal from '../../../hooks/use-modal';
import './add-keyword.less';
import AddProduct from './add-product';
import { useNewLiveStream } from './context';
import { ListProducts } from './list-keyword';
import SearchProducts from './search-products';

interface Props {
    children: ReactElement;
}

const size = 'large';

const SetupKeyWord = (props: Props) => {
    const { visible, toggle } = useModal();
    const { addKeyword, livestream } = useNewLiveStream();

    const [show_list, setShowList] = useState(false);

    const [products, setProducts] = useState<any[]>([]);
    const [keyword, setKeyword] = useState('');

    const validate = useCallback(() => {
        if (products.length === 0) {
            message.error('Bạn chưa chọn sản phẩm');
            return false;
        }

        if (keyword.length === 0) {
            message.error('Bạn chưa điền từ khóa');
            return false;
        }

        if (
            livestream.keywords.map((keywordItem: any) => keywordItem.keyword).indexOf(keyword) !==
            -1
        ) {
            message.error('Từ khoá đã tồn tại');
            return false;
        }

        return true;
    }, [products, keyword, livestream.keywords]);

    const addKeywordAndClose = () => {
        if (!validate()) return;

        addKeyword({
            id: Date.now(),
            keyword,
            products,
        });
        setKeyword('');
        setProducts([]);
        toggle();
    };

    const addKeywordAndAddNew = () => {
        if (!validate()) return;

        addKeyword({
            id: Date.now(),
            keyword,
            products,
        });
        setKeyword('');
        setProducts([]);
    };

    const addProduct = (product: any) => {
        if (
            products.filter((item: any) =>
                item.productId ? item.productId._id === product._id : item._id === product._id
            ).length
        ) {
            message.warning('Sản phẩm này đã được chọn');

            return;
        }

        const newProducts = [...products, product];

        setProducts(newProducts);
    };

    const removeProduct = (productId: string) => {
        const newProducts = products.filter((product: any) => product._id !== productId);

        setProducts(newProducts);
    };

    const updateProduct = (productId: string, price: number) => {
        const newProducts = products.map((product: any) => {
            if (product._id === productId) {
                product.price = price;
            }
            return product;
        });
        setProducts(newProducts);
    };

    const changeKeyword = (e: any) => {
        setKeyword(e.target.value);
    };

    const addOtherService = () => {
        const fakeId: number = products.filter((item) => item.type == 'service').length;
        let newService: any = {
            _id: `service-${fakeId + 1}`,
            name: '',
            price: 0,
            type: 'service',
        };

        setProducts([...products, newService]);
    };

    const updateService = (productId: string, propertyChanged: any) => {
        const newProducts = products.map((product: any) => {
            if (product._id === productId) {
                return { ...product, ...propertyChanged };
            }
            return product;
        });
        setProducts(newProducts);
    };

    const renderContent = () => {
        if (show_list) {
            return null;
        }

        if (products.length > 0) {
            return (
                <ListProducts
                    className='selected-product-table'
                    products={products}
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
        <div>
            {React.cloneElement(props.children, { onClick: toggle })}

            <Modal
                visible={visible}
                onCancel={toggle}
                title='Chọn sản phẩm và tạo từ khóa tương ứng'
                footer={null}
                width={650}
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

                {/* <div className="other-services">
                    <span onClick={addOtherService}>
                        <PlusCircleOutlined /> Thêm dịch vụ khác
                    </span>
                </div> */}

                <div style={{ marginTop: 20 }}>
                    <span className='label_form'>Từ khóa đặt hàng</span>
                    <br />
                    <Input
                        placeholder='Nhập từ khóa đặt hàng'
                        style={{ margin: '10px 0' }}
                        size={size}
                        onChange={changeKeyword}
                        value={keyword}
                    />
                    <br />

                    <div className='secondary-paragraph'>
                        Nếu bạn chọn sản phẩm là SON MAC thì nên đặt từ khóa tương ứng là “MAC”. Nếu
                        sản phẩm là tai nghe Airpod thì từ khóa đặt hàng nên là “AIRPOD”.
                    </div>
                </div>

                <Divider />

                <Row gutter={15} justify='end' align='middle'>
                    <Col span={6}></Col>
                    <Col span={6}>
                        <Button onClick={toggle} block>
                            Hủy
                        </Button>
                    </Col>
                    <Col span={6}>
                        <Button block type='primary' onClick={addKeywordAndClose}>
                            Lưu & Đóng
                        </Button>
                    </Col>
                    <Col span={6}>
                        <Button block type='primary' onClick={addKeywordAndAddNew}>
                            Lưu và Thêm mới
                        </Button>
                    </Col>
                </Row>
            </Modal>
        </div>
    );
};

export default SetupKeyWord;
