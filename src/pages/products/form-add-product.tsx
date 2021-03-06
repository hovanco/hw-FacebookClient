import { AutoComplete, Button, Col, Divider, Form, Input, InputNumber, Row } from 'antd';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IImage } from '../../collections/image';
import { UploadImage } from '../../components';

import {
    createCategory,
    createProduct,
    fetchCategory,
    setCategory,
} from '../../reducers/productState/productAction';
import { formatterInput, parserInput } from '../../utils/format-money';
import './style.less';

const style = {
    marginBottom: 15,
};

interface Props {
    toggle: any;
    reloadTable: any;
    visible: boolean;
}

const { TextArea } = Input;

const FormAddProduct: FC<Props> = (props): JSX.Element => {
    const { toggle, reloadTable, visible } = props;
    const dispatch = useDispatch();

    const category = useSelector(({ product }: { product: any }) => product.category);
    const categoryId = useSelector(({ product }: { product: any }) => product.categoryId);

    const [newCategory, setNewCategory] = useState('');
    const [categoryIdFilter, setCategoryId] = useState('');
    const formRef = useRef<any>(null);

    const [firstImage, setFirstImage] = useState('');
    const [imagesSeleted, setImagesSeleted] = useState<IImage[]>([]);

    const resetForm = () => {
        formRef.current.resetFields();
    };

    useEffect(() => {
        if (categoryId) {
            setCategoryId(categoryId);
        }
    }, [categoryId]);

    const clearCategory = () => {
        setCategoryId('');
        setNewCategory('');
        dispatch(setCategory([]));
    };

    const onFinish = async (values: any) => {
        values.brandId = 'id__temp';
        values.unitId = 'id__temp';
        let images: any[] = [];
        if (imagesSeleted.length > 0) {
            images = imagesSeleted.map((img) => img.key);
        }
        values.images = images;
        categoryIdFilter && (values.categoryId = categoryIdFilter);

        const data = {
            ...values,
            length: values.length || undefined,
            width: values.width || undefined,
            height: values.height || undefined,
            description: (values.description && values.description.length === 0) || undefined,
        };

        const result = await dispatch(createProduct(data));
        if (!!result) {
            clearCategory();
            resetForm();
            setFirstImage('');
            setImagesSeleted([]);
            toggle();
            reloadTable();
        }
    };

    const options = useMemo(() => {
        return (category || []).map((item: { _id: string; name: string; value?: string }) => ({
            ...item,
            value: item.name,
        }));
    }, [category]);

    const filterOption = (inputValue: string, option: any) => {
        return option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;
    };

    const onChange = (value: string) => {
        dispatch(fetchCategory(value));

        setNewCategory(value);
    };

    const onCreateCategory = async () => {
        await dispatch(createCategory(newCategory));
        setNewCategory('');
    };

    const onSelect = (value: string, option: any) => {
        setCategoryId(option._id);
    };

    const onCancel = () => {
        clearCategory();
        resetForm();
        setFirstImage('');
        setImagesSeleted([]);
        toggle();
    };

    const handleImages = (images: IImage[]) => {
        setFirstImage(images[0].key);
        setImagesSeleted(images);
    };

    return (
        <Form ref={formRef} layout='vertical' onFinish={onFinish} className='form__product'>
            <Row gutter={15}>
                <Col span={8}>
                    <div style={{ marginBottom: '10px' }}>???nh s???n ph???m:</div>
                    <UploadImage
                        img={firstImage}
                        handleImages={handleImages}
                        imagesSeleted={imagesSeleted.map((img) => img.key)}
                    />
                </Col>
                <Col span={16}>
                    <Form.Item
                        name='name'
                        label='T??n s???n ph???m'
                        rules={[{ required: true, message: '??i???n t??n s???n ph???m' }]}
                        style={style}
                    >
                        <Input />
                    </Form.Item>

                    {visible && (
                        <div className='form__product--category'>
                            <label htmlFor=''>Danh m???c</label>
                            <AutoComplete
                                style={{ width: '100%' }}
                                options={options}
                                onChange={onChange}
                                onSelect={onSelect}
                                filterOption={filterOption}
                                className='auto--complete'
                            >
                                <Input />
                            </AutoComplete>

                            {category.length === 0 && newCategory.trim().length > 0 && (
                                <p onClick={onCreateCategory} className='category__item'>
                                    T???o m???i danh m???c: {newCategory}
                                </p>
                            )}
                        </div>
                    )}

                    <Form.Item name='code' label='M?? s???n ph???m' style={style}>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name='weight'
                        label='Kh???i l?????ng (gram)'
                        rules={[
                            {
                                required: true,
                                message: 'Kh???i l?????ng s???n ph???m t???i thi???u 10g',
                                type: 'number',
                                min: 10,
                                max: 1000000,
                            },
                        ]}
                        style={style}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={formatterInput}
                            parser={parserInput}
                        />
                    </Form.Item>
                    <Form.Item name='originalPrice' label='Gi?? v???n (vnd)' style={style}>
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={formatterInput}
                            parser={parserInput}
                        />
                    </Form.Item>
                    <Form.Item
                        label='Gi?? b??n l???(vnd)'
                        name='price'
                        rules={[{ required: true, message: '??i???n gi?? b??n l???' }]}
                        style={style}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={formatterInput}
                            parser={parserInput}
                        />
                    </Form.Item>
                    <Form.Item name='wholesalePrice' label='Gi?? bu??n (vnd)' style={style}>
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={formatterInput}
                            parser={parserInput}
                        />
                    </Form.Item>
                    <Form.Item name='length' label='Chi???u d??i' style={style}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name='width' label='Chi???u r???ng' style={style}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name='height' label='Chi???u Cao' style={style}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name='description' label='Chi ti???t' style={style}>
                        <TextArea style={{ width: '100%' }} />
                    </Form.Item>

                    <Divider />

                    <Form.Item>
                        <Button style={{ marginRight: 15 }} onClick={onCancel}>
                            H???y
                        </Button>
                        <Button type='primary' htmlType='submit'>
                            Th??m
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default FormAddProduct;
