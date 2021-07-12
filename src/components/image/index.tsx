import { CheckOutlined, CloseCircleFilled, StarFilled } from '@ant-design/icons';
import { message } from 'antd';
import React, { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { removeImageRequest, updateImageRequest } from '../../api/images-api';
import { IImage } from '../../collections/image';
import { IMG_URL } from '../../configs/vars';
import { removeImage, toggleBookmark } from '../../reducers/imagesState/imagesAction';
import './style.less';

interface Props {
    image: IImage;
    select?: boolean;
    handleSelect: (id: string) => void;
    removeSelect: (id: string) => void;
}

const Image: FC<Props> = ({ image, select = false, handleSelect, removeSelect }) => {
    const token = useSelector((state: any) => state.auth.token);
    const store = useSelector((state: any) => state.store.store);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const onSelect = () => {
        if (select) {
            removeSelect(image.key);
        } else {
            handleSelect(image.key);
        }
    };

    const handleRemoveImage = async () => {
        setLoading(true);

        try {
            const response = await removeImageRequest({
                token: token.accessToken,
                storeId: store._id,
                imageId: image._id,
            });

            dispatch(removeImage(image._id));

            message.success('Đã xóa hình ảnh');
        } catch (error) {
            message.error('Lỗi xóa hình ảnh');
        }
    };

    const likeImage = async () => {
        const messageSuccess = image.star ? 'Đã xóa khỏi yêu thích' : 'Đã thêm vào yêu thích';
        const messageError = image.star ? 'Lỗi xóa khỏi yêu thích' : 'Lỗi thêm vào yêu thích';
        try {
            const response = await updateImageRequest({
                token: token.accessToken,
                storeId: store._id,
                imageId: image._id,
                data: {
                    star: !image.star,
                },
            });

            dispatch(toggleBookmark(image._id));

            message.success(messageSuccess);
        } catch (error) {
            message.error(messageError);
        }
    };

    const bookmarkClass = image.star ? 'bookmark star' : 'bookmark';
    const color_star = image.star ? 'yellow' : 'gray';

    return (
        <div className='image' style={{ backgroundImage: `url(${IMG_URL}${image.key})` }}>
            <div className='gray' onClick={onSelect} />
            {select && (
                <div className='select' onClick={onSelect}>
                    <CheckOutlined style={{ color: '#fff' }} />
                </div>
            )}

            <div className='remove' onClick={handleRemoveImage}>
                <CloseCircleFilled />
            </div>
            <div className={bookmarkClass} onClick={likeImage}>
                <StarFilled style={{ color: color_star }} />
            </div>

            <div className='name'>{image.name}</div>
        </div>
    );
};

export default Image;
