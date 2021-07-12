import { CheckOutlined, CloseOutlined, ReloadOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Col, Divider, Input, InputNumber, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { flatten, isNumber } from 'lodash';
import querystring from 'querystring';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IImage } from '../../collections/image';
import { IProduct } from '../../collections/product';
import { UploadImage } from '../../components';
import {
    createCategory,
    deleteProduct,
    fetchCategory,
    fetchProducts,
    updateProduct,
} from '../../reducers/productState/productAction';
import formatMoney, { formatterInput, parserInput } from '../../utils/format-money';
import Action from './action';
import AddProduct from './add-product';
import BtnRemoveProduct from './btn-remove-product';
import InputSize from './input-size';
import './product-table.less';

const errorStyle = {
    borderColor: 'red',
};

const LIMIT = 20;
const { Search } = Input;

const ProductsTable: FC = (): JSX.Element => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selected, setSelected] = useState<any | null>(null);
    const [textSearch, setTextSearch] = useState<string>('');
    const [page, setPage] = useState<number>(1);

    const dispatch = useDispatch();
    const products: IProduct[] = useSelector(
        ({ product }: { product: any }) => product.products.data
    );
    const total = useSelector(({ product }: { product: any }) => product.products.total);
    const loading = useSelector(({ product }: { product: any }) => product.loading);

    const category = useSelector(({ product }: { product: any }) => product.category);
    const categoryId = useSelector(({ product }: { product: any }) => product.categoryId);
    const [newCategory, setNewCategory] = useState('');
    const [categoryIdFilter, setCategoryId] = useState<any>('');
    const [sort, setSort] = useState<any>(null);

    const options = useMemo(() => {
        return (category || []).map((item: { _id: string; name: string; value?: string }) => ({
            ...item,
            value: item.name,
        }));
    }, [category]);

    useEffect(() => {
        if (categoryId) {
            setCategoryId(categoryId);
        }
    }, [categoryId]);

    const onSelect = (value: string, option: any) => {
        setCategoryId(option._id);
    };

    const filterOption = (inputValue: string, option: any) => {
        return option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;
    };

    const onChangeCategory = (value: string) => {
        dispatch(fetchCategory(value));
        setCategoryId(null);
        setNewCategory(value);
    };

    const onCreateCategory = async () => {
        await dispatch(createCategory(newCategory));
        setNewCategory('');
    };

    const [dataSource, setDataSource] = useState(
        (products || []).map((i: IProduct) => ({
            ...i,
            key: i._id,
        }))
    );
    const [productSelected, setProductSelected] = useState<any>();

    const onChange = (e: any) => {
        const { value, name } = e.target || {};
        if (selected) {
            setSelected({ ...selected, [name]: value });
        }
    };

    const onChangeOriginalPrice = (value: number | string | undefined) => {
        if (selected && isNumber(value)) {
            setSelected({ ...selected, originalPrice: value });
        }
    };

    const onChangePrice = (value: number | string | undefined) => {
        if (selected && isNumber(value)) {
            setSelected({ ...selected, price: value });
        }
    };

    const onChangeWholesalePrice = (value: number | string | undefined) => {
        if (selected && isNumber(value)) {
            setSelected({ ...selected, wholesalePrice: value });
        }
    };

    const onChangeWeight = (value: number | string | undefined) => {
        if (selected && isNumber(value)) {
            setSelected({ ...selected, weight: value });
        }
    };

    const onChangeLength = (value: number | string | undefined) => {
        if (selected && isNumber(value)) {
            setSelected({ ...selected, length: value });
        }
    };

    const onChangeHeight = (value: number | string | undefined) => {
        if (selected && isNumber(value)) {
            setSelected({ ...selected, height: value });
        }
    };

    const onChangeWidth = (value: number | string | undefined) => {
        if (selected && isNumber(value)) {
            setSelected({ ...selected, width: value });
        }
    };

    const searchProduct = (value: string) => {
        dispatch(fetchProducts({ textSearch: value.trim(), page: 1, limit: LIMIT, sort }));
    };

    const refreshProduct = () => {
        setPage(1);
        searchProduct(textSearch);
    };

    const reloadTable = () => {
        dispatch(fetchProducts({ textSearch, page, limit: LIMIT, sort }));
        setSelectedRowKeys([]);
    };

    useEffect(() => {
        dispatch(fetchProducts({ page: 1, limit: LIMIT }));
    }, []);

    useEffect(() => {
        setDataSource(
            (products || []).map((i: IProduct) => ({
                ...i,
                key: i._id,
            }))
        );
    }, [products]);

    const handleImages = async (images: IImage[]) => {
        let newImage: string[] = [];

        images.forEach((img) => {
            if (img && img.key) newImage.push(img.key);
        });
        const data = {
            _id: productSelected._id,
            images: newImage,
        };
        await dispatch(updateProduct(data));
        const tempDataSource = products.map((item: any) => {
            if (item._id === productSelected._id) {
                item.images = newImage;
            }
            return item;
        });
        productSelected.images = newImage;
        setDataSource(tempDataSource);
    };

    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
        setPage(pagination.current);

        const columnFilters = flatten([sorter])
            .filter((col: any) => !!col.order)
            .map((col: any) => ({
                key: col.columnKey,
                value: col.order === 'ascend' ? 'asc' : 'desc',
            }));

        if (columnFilters.length === 0) {
            setSort(null);
            dispatch(fetchProducts({ textSearch, page: pagination.current, limit: LIMIT }));
        } else {
            const objFilter = Object.fromEntries(
                columnFilters.map((item) => [item.key, item.value])
            );
            setSort(querystring.stringify(objFilter));
            dispatch(
                fetchProducts({
                    textSearch,
                    page: pagination.current,
                    limit: LIMIT,
                    sort: querystring.stringify(objFilter),
                })
            );
        }
    };

    const columns: ColumnsType<any> | undefined = [
        {
            title: <span className='th'>Hình ảnh</span>,
            dataIndex: 'images',
            key: 'img',
            render: (images) => (
                <UploadImage
                    size={50}
                    img={images.length > 0 ? images[0] : ''}
                    handleImages={handleImages}
                    imagesSeleted={images}
                />
            ),
        },
        {
            title: <span className='th'>Tên</span>,
            dataIndex: '',
            key: 'name',
            sorter: {
                compare: () => 0,
                multiple: 0,
            },
            render: ({ name, _id }) => {
                if (selected && selected._id === _id) {
                    const style =
                        selected.name.length === 0 ? { ...errorStyle, width: 80 } : { width: 80 };

                    return (
                        <Input
                            name='name'
                            value={selected.name}
                            onChange={onChange}
                            style={style}
                        />
                    );
                }
                return name;
            },
        },
        {
            title: <span className='th'>Mã</span>,
            dataIndex: '',
            key: 'code',
            render: ({ code, _id }) => {
                if (selected && selected._id === _id) {
                    const style = { width: 80 };

                    return (
                        <Input
                            name='code'
                            value={selected.code}
                            onChange={onChange}
                            style={style}
                        />
                    );
                }

                if (!code) return '';

                return code;
            },
        },
        {
            title: <span className='th'>Danh mục</span>,
            dataIndex: '',
            key: 'categoryId',
            render: ({ categoryId, _id }) => {
                if (selected && selected._id === _id) {
                    const style = { width: 100 };

                    return (
                        <div className='product__table--category'>
                            <AutoComplete
                                style={style}
                                options={options}
                                onChange={onChangeCategory}
                                onSelect={onSelect}
                                filterOption={filterOption}
                                searchValue={selected.categoryId ? selected.categoryId.name : ''}
                            >
                                <Input />
                            </AutoComplete>

                            {category.length === 0 && newCategory.trim().length > 0 && (
                                <p onClick={onCreateCategory} className='category__item'>
                                    Tạo mới danh mục: {newCategory}
                                </p>
                            )}
                        </div>
                    );
                }

                if (!categoryId) return '';

                return categoryId.name;
            },
        },
        {
            title: <span className='th'>Giá vốn (vnd)</span>,
            dataIndex: '',
            key: 'originalPrice',
            sorter: {
                compare: () => 0,
                multiple: 0,
            },
            render: ({ originalPrice, _id }) => {
                if (selected && selected._id === _id) {
                    return (
                        <InputNumber
                            name='originalPrice'
                            min={1}
                            formatter={formatterInput}
                            parser={parserInput}
                            value={selected.originalPrice}
                            onChange={onChangeOriginalPrice}
                        />
                    );
                }

                if (!originalPrice) return '';

                return formatMoney(originalPrice);
            },
        },
        {
            title: <span className='th'>Giá bán (vnd)</span>,
            dataIndex: '',
            key: 'price',
            sorter: {
                compare: () => 0,
                multiple: 0,
            },
            render: ({ price, _id }) => {
                if (selected && selected._id === _id) {
                    const style = !selected.price ? { ...errorStyle } : {};

                    return (
                        <InputNumber
                            name='price'
                            min={1}
                            formatter={formatterInput}
                            parser={parserInput}
                            value={selected.price}
                            onChange={onChangePrice}
                            style={style}
                        />
                    );
                }

                if (!price) return '"';

                return formatMoney(price);
            },
        },
        {
            title: <span className='th'>Giá buôn (vnd)</span>,
            dataIndex: '',
            key: 'wholesalePrice',
            sorter: {
                compare: () => 0,
                multiple: 0,
            },
            render: ({ wholesalePrice, _id }) => {
                if (selected && selected._id === _id) {
                    return (
                        <InputNumber
                            name='wholesalePrice'
                            min={1}
                            formatter={formatterInput}
                            parser={parserInput}
                            value={selected.wholesalePrice}
                            onChange={onChangeWholesalePrice}
                        />
                    );
                }
                if (!wholesalePrice) return '';

                return formatMoney(wholesalePrice);
            },
        },
        {
            title: <span className='th'>C/dài</span>,
            dataIndex: '',
            key: 'length',
            align: 'center',
            sorter: {
                compare: () => 0,
                multiple: 0,
            },
            render: ({ length, _id }) => {
                if (selected && selected._id === _id) {
                    return <InputSize size={selected.length} changeSize={onChangeLength} />;
                }

                if (!length) return '"';

                return length;
            },
        },
        {
            title: <span className='th'>C/rộng</span>,
            dataIndex: '',
            key: 'width',
            align: 'center',
            sorter: {
                compare: () => 0,
                multiple: 0,
            },
            render: ({ width, _id }) => {
                if (selected && selected._id === _id) {
                    return <InputSize size={selected.width} changeSize={onChangeWidth} />;
                }

                if (!width) return '"';

                return width;
            },
        },
        {
            title: <span className='th'>C/cao</span>,
            dataIndex: '',
            key: 'height',
            align: 'center',
            sorter: {
                compare: () => 0,
                multiple: 0,
            },
            render: ({ height, _id }) => {
                if (selected && selected._id === _id) {
                    return <InputSize size={selected.height} changeSize={onChangeHeight} />;
                }

                if (!height) return '"';

                return height;
            },
        },

        {
            title: <span className='th'>KL (gram)</span>,
            dataIndex: '',
            align: 'center',
            key: 'weight',
            sorter: {
                compare: () => 0,
                multiple: 0,
            },
            render: ({ weight, _id }) => {
                if (selected && selected._id === _id) {
                    const style = selected.weight === 0 ? errorStyle : {};
                    return (
                        <InputNumber
                            value={selected.weight}
                            onChange={onChangeWeight}
                            style={style}
                            min={10}
                            max={100000}
                        />
                    );
                }

                if (!weight) return '"';

                return weight;
            },
        },
        {
            title: '',
            dataIndex: '',
            align: 'right',
            key: 'x',
            render: (product) => {
                const onEdit = () => {
                    product.categoryId && setCategoryId(product.categoryId._id);
                    setSelected(product);
                };

                const onSave = async () => {
                    if (!categoryIdFilter) {
                        delete selected.categoryId;
                    } else {
                        selected.categoryId = categoryIdFilter;
                    }
                    const result = await dispatch(
                        updateProduct({ ...selected, images: productSelected.images })
                    );
                    if (!!result) {
                        reloadTable();
                        setSelected(null);
                        setNewCategory('');
                        setCategoryId('');
                    }
                };

                const removeProduct = () => {
                    dispatch(deleteProduct(product._id));
                };

                const onCancel = () => {
                    setNewCategory('');
                    setCategoryId('');
                    setSelected(null);
                };

                return (
                    <div
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        {selected && selected._id === product._id ? (
                            <>
                                <Button
                                    onClick={onSave}
                                    type='primary'
                                    icon={<CheckOutlined />}
                                ></Button>

                                <Divider type='vertical' />

                                <Button
                                    onClick={onCancel}
                                    danger
                                    type='primary'
                                    icon={<CloseOutlined />}
                                ></Button>
                            </>
                        ) : (
                            <Action
                                product={product}
                                removeProduct={removeProduct}
                                onCancel={onCancel}
                                onEdit={onEdit}
                            />
                        )}
                    </div>
                );
            },
        },
    ];

    const onSelectChange = (selectedRows: any) => {
        setSelectedRowKeys(selectedRows);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const resetSelect = () => {
        setSelectedRowKeys([]);
    };

    return (
        <>
            <Row style={{ marginBottom: 20 }} justify='space-between' align='middle'>
                <Col>
                    <Row justify='space-between' align='middle'>
                        <Col>
                            <Search
                                // ref={this.searchRef}
                                onChange={(e) => setTextSearch(e.target.value)}
                                onSearch={searchProduct}
                                style={{ maxWidth: 250 }}
                                placeholder='Tìm theo tên, mã sản phẩm'
                                value={textSearch}
                            />
                        </Col>
                        <Col>
                            <Button
                                onClick={refreshProduct}
                                style={{ margin: '0 10px' }}
                                icon={<ReloadOutlined />}
                            ></Button>
                        </Col>
                        <Col>
                            <AddProduct reloadTable={reloadTable} />
                        </Col>
                    </Row>
                </Col>
                <Col>
                    {selectedRowKeys.length > 0 && (
                        <BtnRemoveProduct
                            products={selectedRowKeys}
                            resetSelect={resetSelect}
                            textSearch={textSearch}
                            page={page}
                            limit={LIMIT}
                        />
                    )}
                </Col>
            </Row>

            <Table
                className='product__table'
                loading={loading}
                rowSelection={rowSelection}
                dataSource={dataSource}
                columns={columns}
                onChange={handleTableChange}
                onRow={(r) => ({
                    onClick: () => setProductSelected(r),
                })}
                rowKey='_id'
                pagination={{
                    current: page,
                    total,
                    pageSize: LIMIT,
                }}
            />
        </>
    );
};

export default ProductsTable;
