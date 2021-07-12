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
                    <div style={{ marginBottom: '10px' }}>Ảnh sản phẩm:</div>
                    <UploadImage
                        img={firstImage}
                        handleImages={handleImages}
                        imagesSeleted={imagesSeleted.map((img) => img.key)}
                    />
                </Col>
                <Col span={16}>
                    <Form.Item
                        name='name'
                        label='Tên sản phẩm'
                        rules={[{ required: true, message: 'Điền tên sản phẩm' }]}
                        style={style}
                    >
                        <Input />
                    </Form.Item>

                    {visible && (
                        <div className='form__product--category'>
                            <label htmlFor=''>Danh mục</label>
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
                                    Tạo mới danh mục: {newCategory}
                                </p>
                            )}
                        </div>
                    )}

                    <Form.Item name='code' label='Mã sản phẩm' style={style}>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name='weight'
                        label='Khối lượng (gram)'
                        rules={[
                            {
                                required: true,
                                message: 'Khối lượng sản phẩm tối thiểu 10g',
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
                    <Form.Item name='originalPrice' label='Giá vốn (vnd)' style={style}>
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={formatterInput}
                            parser={parserInput}
                        />
                    </Form.Item>
                    <Form.Item
                        label='Giá bán lẻ(vnd)'
                        name='price'
                        rules={[{ required: true, message: 'Điền giá bán lẻ' }]}
                        style={style}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={formatterInput}
                            parser={parserInput}
                        />
                    </Form.Item>
                    <Form.Item name='wholesalePrice' label='Giá buôn (vnd)' style={style}>
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={formatterInput}
                            parser={parserInput}
                        />
                    </Form.Item>
                    <Form.Item name='length' label='Chiều dài' style={style}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name='width' label='Chiều rộng' style={style}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name='height' label='Chiều Cao' style={style}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name='description' label='Chi tiết' style={style}>
                        <TextArea style={{ width: '100%' }} />
                    </Form.Item>

                    <Divider />

                    <Form.Item>
                        <Button style={{ marginRight: 15 }} onClick={onCancel}>
                            Hủy
                        </Button>
                        <Button type='primary' htmlType='submit'>
                            Thêm
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default FormAddProduct;
