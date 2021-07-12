import _ from 'lodash';
import { Badge, Button, message, Modal } from 'antd';
import React, { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { likeImageRequest, removeImageRequest } from '../../../api/images-api';
import { removeImage, toggleBookmark } from '../../../reducers/imagesState/imagesAction';
import { IImage } from '../../../collections/image';

interface Props {
    images: string[];
    action: 'remove' | 'bookmark';
    callBack?: () => void;
}

const BtnActionImages: FC<Props> = ({ images, action, callBack }) => {
    const [loading, setLoading] = useState(false);
    const token = useSelector((state: any) => state.auth.token);
    const store = useSelector((state: any) => state.store.store);
    const dataImages = useSelector((state: any) => state.images.images);
    const dispatch = useDispatch();

    const renderBadge = images.length > 0 && (
        <Badge style={{ marginRight: 10 }} count={images.length} />
    );

    const showConfirm = () => {
        const imagesExistInProduct = dataImages.filter(
            (img: IImage) => images.includes(img._id) && !_.isEmpty(img.productIds)
        );
        const count = imagesExistInProduct.length;
        return Modal.confirm({
            title: count > 0 ? 'Cảnh báo' : 'Xác nhận',
            content:
                count > 0 ? (
                    <div>
                        <span>
                            Ảnh: {imagesExistInProduct.map((img: IImage) => img.name).join(', ')} đã
                            tồn tại trong ảnh của sản phẩm.
                        </span>
                        <br />
                        Nếu bạn đồng ý xóa, đồng nghĩa với việc xóa ảnh này trong sản phẩm của bạn!
                    </div>
                ) : (
                    'Bạn chắc chắn muốn xóa ảnh đã chọn?'
                ),
            okText: 'Xóa ảnh',
            okType: 'danger',
            cancelText: 'Hủy',
            width: 450,
            centered: true,
            onOk() {
                removeImages();
            },
            onCancel() {},
        });
    };

    const removeImages = async () => {
        setLoading(true);
        try {
            const response = await Promise.all(
                images.map(async (imageId) => {
                    const response = await removeImageRequest({
                        token: token.accessToken,
                        storeId: store._id,
                        imageId,
                    });

                    dispatch(removeImage(imageId));

                    return response;
                })
            );
            setLoading(false);
            message.success(`Đã xóa ${images.length} hình ảnh`);
            if (callBack) {
                callBack();
            }
        } catch (error) {
            message.error(`Lỗi xóa hình ảnh`);
        }
    };

    const bookMarkImages = () => {
        setLoading(true);
        Promise.all(
            images.map(async (imageId) => {
                const response = await likeImageRequest({
                    token: token.accessToken,
                    storeId: store._id,
                    imageId,
                    star: true,
                });

                dispatch(toggleBookmark(imageId));
            })
        )
            .then(() => {
                message.success(`Đã ${images.length} thêm vào yêu thích`);
                setLoading(false);
                if (callBack) {
                    callBack();
                }
            })
            .catch(() => {
                message.error('Lỗi thêm vào yêu thích');
                setLoading(false);
            });
    };

    const onClick = () => {
        if (action === 'remove') {
            showConfirm();
        }
        if (action === 'bookmark') {
            bookMarkImages();
        }
    };

    const title = action === 'remove' ? 'Xóa ảnh' : 'Yêu thích';

    return (
        <Button onClick={onClick} loading={loading}>
            {!loading && renderBadge}
            {title}
        </Button>
    );
};

export default BtnActionImages;
