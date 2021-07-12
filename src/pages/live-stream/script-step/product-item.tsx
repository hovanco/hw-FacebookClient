import React from 'react';
import { Avatar } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import { IMG_URL } from '../../../configs/vars';

interface Props {
    product: any;
}

const ProductItem = ({ product }: Props) => {
    let productData = product.productId ? product.productId : product;

    return (
        <div className='product-item'>
            <div className='product-item-image'>
                {productData.images.length > 0 ? (
                    <Avatar shape='square' size={40} src={`${IMG_URL}${productData.images[0]}`} />
                ) : (
                    <Avatar shape='square' size={40} icon={<PictureOutlined />} />
                )}
            </div>
            <div className='product-item-content'>
                <div className='product-item-content-name'>{productData.name}</div>
                {productData.code ? (
                    <div className='product-item-content-code'>{productData.code}</div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
};

export default ProductItem;
