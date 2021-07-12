import { DeleteFilled } from '@ant-design/icons';
import { message } from 'antd';
import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { deleteGallery } from '../../../api/gallery-api';
import * as actions from '../../../reducers/imagesState/imagesAction';

interface Props {
    gallery: any;
    active: any;
    handelClickGallery: (category: any) => void;
}

const GalleryItem: FC<Props> = ({ gallery, active, handelClickGallery }): JSX.Element => {
    const token = useSelector((state: any) => state.auth.token);
    const store = useSelector((state: any) => state.store.store);
    const dispatch = useDispatch();
    const className = active ? 'cate active' : 'cate';

    const onClick = () => {
        handelClickGallery(gallery);
    };

    const handleDeleteGallery = async () => {
        try {
            const response = await deleteGallery({
                token: token.accessToken,
                storeId: store._id,
                galleryId: gallery._id,
            });
            handelClickGallery(null);
            dispatch(actions.deleteGallery(gallery._id));
            message.success('Đã xóa danh mục hình ảnh');
        } catch (error) {
            message.error('Lỗi xóa danh mục hình ảnh');
        }
    };

    return (
        <div className={className}>
            <div onClick={onClick} className='inner'>
                {gallery.name}
            </div>
            <div className='delete' onClick={handleDeleteGallery}>
                <DeleteFilled />
            </div>
        </div>
    );
};

export default GalleryItem;
