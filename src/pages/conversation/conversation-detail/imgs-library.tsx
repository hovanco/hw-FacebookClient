import { CloseOutlined } from '@ant-design/icons';
import { Badge, Button, Col, Row } from 'antd';
import { get } from 'lodash';
import moment from 'moment';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateImageRequest } from '../../../api/images-api';
import { uploadImagesRequest } from '../../../api/upload-api';
import { IImage } from '../../../collections/image';
import { BtnUpload, Image, Loading } from '../../../components';
import { IMG_URL } from '../../../configs/vars';
import {
    addImages,
    fetchGallery,
    fetchImages,
    fetchImagesBookmark,
    toggleBookmark,
} from '../../../reducers/imagesState/imagesAction';
import AddCategoryImg from './add-category-img';
import AddImageGallery from './add-image-gallery';
import BtnActionImages from './btn-action-images';
import { useConversationDetail } from './context';
import GalleryItem from './gallery-item';
import './imgs-library.less';
import SearchImage from './search-image';

interface Props {
    toggle: () => void;
    affterClose?: () => void;
    handleImageSelect: (images: IImage[], message?: any) => void;
    type?: number;
    imagesSeleted?: any[];
}

export interface IGallery {
    _id: string;
    name: string;
}

const ImgsLibrary: FC<Props> = ({
    toggle,
    affterClose,
    handleImageSelect,
    type,
    imagesSeleted = [],
}): JSX.Element => {
    const dispatch = useDispatch();
    const { setImageSend, ...state } = useConversationDetail();

    const [loading, setLoading] = useState(false);
    const [images_select, setImagesSelect] = useState<any[]>(() => {
        if (imagesSeleted.length > 0) {
            return imagesSeleted;
        } else {
            return state.images.map((image: IImage) => image.key);
        }
    });
    const [todoGallery, setTodoGallery] = useState<IGallery | null | 'bookmark'>(null);
    const [idImagesSelected, setIdImagesSelected] = useState<string[]>([]);
    const token = useSelector((state: any) => state.auth.token);
    const store = useSelector((state: any) => state.store.store);
    const gallery = useSelector((state: any) => state.images.gallery);
    const images = useSelector((state: any) => state.images.images);
    const page: { fbObjectId: string; name: string } = useSelector(
        ({ fanpage }: { fanpage: any }) => fanpage.page
    );

    const text_search = useSelector((state: any) => state.images.text_search);
    const loadingImages = useSelector((state: any) => state.images.loading);

    const handleUpload = async (e: any) => {
        setLoading(true);
        try {
            const files = Array.from(e.target.files).map((file: any) => {
                return file;
            });
            e.target.value = null;

            const res = await uploadImagesRequest({
                storeId: store._id,
                galleryId: get(todoGallery, '_id'),
                token: token.accessToken,
                files,
            });

            if (Array.isArray(res)) {
                dispatch(addImages(res));
                if (todoGallery === 'bookmark') {
                    for (const image of res) {
                        await updateImageRequest({
                            token: token.accessToken,
                            storeId: store._id,
                            imageId: image._id,
                            data: {
                                star: true,
                            },
                        });
                        dispatch(toggleBookmark(image._id));
                    }
                }
                setLoading(false);
            } else {
                setLoading(false);
            }
        } catch (error) {}
    };

    const handleSelect = (img: string) => {
        setImagesSelect([...images_select, img]);
    };

    const removeSelect = (img: string) => {
        const filterImgs = images_select.filter((i: string) => i !== img);
        setImagesSelect(filterImgs);
    };

    const selectImageSend = () => {
        const arr_images = filterInfoImages(images_select);
        if (type === undefined) {
            handleImageSelect(arr_images);
        } else {
            const messages = [];

            for (let i = 0; i < arr_images.length; i++) {
                let newMessage: any = {
                    create_time: moment(new Date()).format(),
                    from: {
                        name: page.name,
                        email: '',
                        id: page.fbObjectId,
                    },
                    id: Date.now() + i,
                    type,
                };

                if (type === 2) {
                    newMessage.attachment = {
                        type: 'photo',
                        media: {
                            image: {
                                src: IMG_URL + arr_images[i].key,
                            },
                        },
                    };
                } else if (type === 1) {
                    newMessage.attachments = {
                        data: [{ image_data: { preview_url: IMG_URL + arr_images[i].key } }],
                    };
                }

                messages.push(newMessage);
            }

            handleImageSelect(arr_images, messages);
        }
        toggle();
    };

    useEffect(() => {
        dispatch(fetchGallery());
    }, []);

    useEffect(() => {
        const arr_images = filterInfoImages(imagesSeleted);
        setImagesSelect(arr_images.map((item: any) => item.key));
    }, [images]);

    useEffect(() => {
        const ids = images
            .filter((i: IImage) => images_select.includes(i.key))
            .map((img: IImage) => img._id);
        setIdImagesSelected(ids);
    }, [images_select]);

    useEffect(() => {
        if (todoGallery && todoGallery !== 'bookmark') {
            dispatch(fetchImages(todoGallery._id));
        } else if (todoGallery === 'bookmark') {
            // load message bookmar
            dispatch(fetchImagesBookmark());
        } else {
            dispatch(fetchImages());
        }
    }, [todoGallery]);

    const filterInfoImages = (tempData: any[]) => {
        const arr_images = tempData
            .map((imageId: string) => {
                const image = images.find((i: IImage) => i.key === imageId);
                if (!image) return null;
                return image;
            })
            .filter((item) => !!item);
        return arr_images;
    };

    const renderContent = () => {
        if (loadingImages) {
            return <Loading />;
        }

        if (images.length === 0) return <div></div>;

        const filter_images = () => {
            if (text_search.length === 0) return images;

            return images.filter((image: IImage) => image.name.includes(text_search));
        };

        return (
            <Row gutter={15}>
                {filter_images().map((image: IImage) => {
                    const select = images_select.includes(image.key);

                    return (
                        <Col key={image.key} style={{ marginBottom: 15 }}>
                            <Image
                                select={select}
                                image={image}
                                handleSelect={handleSelect}
                                removeSelect={removeSelect}
                            />
                        </Col>
                    );
                })}
            </Row>
        );
    };

    const handelClickGallery = (item: IGallery) => {
        setTodoGallery(item);
    };

    const elmGallery = () => {
        return (gallery || []).map((item: IGallery) => {
            return (
                <GalleryItem
                    key={item._id}
                    active={
                        todoGallery && todoGallery !== 'bookmark' && todoGallery._id === item._id
                    }
                    gallery={item}
                    handelClickGallery={handelClickGallery}
                />
            );
        });
    };

    const renderBadge = images_select.length > 0 && (
        <Badge style={{ marginRight: 10 }} count={images_select.length} />
    );

    return (
        <div className='imgs-library'>
            <Row>
                <Col span={6} className='imgs-col'>
                    <div className='heading'>Danh mục</div>

                    <div className='content'>
                        <div className='listCate'>
                            <div
                                onClick={() => setTodoGallery(null)}
                                className={`cate ${!todoGallery ? 'active' : ''}`}
                            >
                                <div className='inner'>Tất cả</div>
                            </div>

                            <div
                                onClick={() => setTodoGallery('bookmark')}
                                className={`cate ${todoGallery === 'bookmark' ? 'active' : ''}`}
                            >
                                <div className='inner'>Yêu thích</div>
                            </div>

                            {elmGallery()}
                        </div>
                    </div>
                    <div className='footer-img' style={{ textAlign: 'center' }}>
                        <AddCategoryImg />
                    </div>
                </Col>
                <Col span={18} className='imgs-col'>
                    <div className='heading'>
                        <Row align='middle' justify='space-between' gutter={15}>
                            <Col style={{ flex: 1 }}>
                                <SearchImage gallery={todoGallery} />
                            </Col>
                            <Col>
                                <CloseOutlined onClick={toggle} />
                            </Col>
                        </Row>
                    </div>

                    <div className='content'>{renderContent()}</div>

                    <div className='footer-img'>
                        <Row align='middle' gutter={15}>
                            <Col>
                                <BtnUpload loading={loading} multiple handleUpload={handleUpload} />
                            </Col>
                            {images_select.length > 0 && (
                                <>
                                    <Col>
                                        <BtnActionImages
                                            images={idImagesSelected}
                                            action='remove'
                                            callBack={() => setImagesSelect([])}
                                        />
                                    </Col>
                                    <Col>
                                        <AddImageGallery
                                            images={idImagesSelected}
                                            callBack={() => setImagesSelect([])}
                                        />
                                    </Col>
                                </>
                            )}
                            <Col>
                                <Button type='primary' onClick={selectImageSend}>
                                    {renderBadge}
                                    Gửi ảnh đã chọn
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ImgsLibrary;
