import { Badge, Button, Form, Modal, Select } from 'antd';
import { Store } from 'antd/lib/form/interface';
import React, { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { updateImageRequest } from '../../../api/images-api';
import useModal from '../../../hooks/use-modal';
import { fetchImages } from '../../../reducers/imagesState/imagesAction';
import { IGallery } from './imgs-library';

interface Props {
    images: string[];
    callBack?: () => void;
}

const AddImageGallery: FC<Props> = ({ images, callBack }): JSX.Element => {
    const [loading, setLoading] = useState(false);
    const { toggle, visible } = useModal();
    const gallery = useSelector((state: any) => state.images.gallery);
    const store = useSelector((state: any) => state.store.store);
    const token = useSelector((state: any) => state.auth.token);

    const dispatch = useDispatch();

    const onFinish = async (values: Store) => {
        setLoading(true);

        try {
            const data =
                values.gallery === 'star'
                    ? { star: true }
                    : {
                          galleryId: values.gallery,
                      };

            const reponse = await Promise.all(
                images.map(
                    async (imageId: string): Promise<any> => {
                        const res = await updateImageRequest({
                            token: token.accessToken,
                            storeId: store._id,
                            imageId,
                            data: {
                                ...data,
                            },
                        });

                        return res;
                    }
                )
            );

            setLoading(false);
            toggle();

            dispatch(fetchImages());
            if (callBack) {
                callBack();
            }
        } catch (error) {
            setLoading(false);
        }
    };

    const renderNumber =
        images.length > 0 ? (
            <Badge style={{ marginRight: 10 }} count={images.length}></Badge>
        ) : null;

    return (
        <>
            <Button onClick={toggle}>{renderNumber} Thêm vào danh mục</Button>

            <Modal visible={visible} onCancel={toggle} title='Thêm vào danh mục' footer={null}>
                <Form onFinish={onFinish} layout='vertical'>
                    <Form.Item
                        label='Chọn danh mục'
                        name='gallery'
                        rules={[
                            {
                                required: true,
                                message: 'Chọn danh mục',
                            },
                        ]}
                    >
                        <Select placeholder='Chọn thư mục'>
                            <Select.Option value='star'>Yêu thích</Select.Option>
                            {(gallery || []).map((item: IGallery) => {
                                return (
                                    <Select.Option key={item._id} value={item._id}>
                                        {item.name}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button onClick={toggle}>Hủy</Button>
                        <Button
                            type='primary'
                            htmlType='submit'
                            style={{ marginLeft: 15 }}
                            loading={loading}
                        >
                            Đồng ý
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default AddImageGallery;
