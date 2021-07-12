import { CloseCircleFilled } from '@ant-design/icons';
import { InputNumber, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { FC } from 'react';
import formatMoney from '../../utils/format-money';

interface Props {
    order?: any;
    products: any;
    removeProduct: any;
    updateProduct: any;
    disabled?: boolean;
}

const TableOrderList: FC<Props> = ({
    order,
    products,
    removeProduct,
    updateProduct,
    disabled = false,
}): JSX.Element => {
    const dataSource: any[] = products.map((product: any, key: number) => {
        return {
            ...product,
            key: product.productId._id,
            stt: key + 1,
        };
    });

    const columns: ColumnsType<any> = [
        {
            title: 'STT',
            width: 30,
            dataIndex: 'stt',
            align: 'center',
            key: 'stt',
        },
        {
            title: 'Tên',
            dataIndex: '',
            render: (product: any) => {
                return product.productId.name;
            },
            key: 'name',
        },
        {
            title: 'KL',
            dataIndex: '',
            key: 'weight',
            render: (product: any) => {
                return product.productId.weight;
            },
        },

        {
            title: 'SL',
            dataIndex: '',
            key: 'count',
            render: (product: any) => {
                const onChangeCount = (value: any) => {
                    const new_products = products.map((p: any) => {
                        if (p.productId._id === product.productId._id)
                            return { ...p, count: value };
                        return p;
                    });

                    updateProduct(new_products);
                };

                return (
                    <InputNumber
                        value={product.count}
                        min={1}
                        onChange={onChangeCount}
                        disabled={disabled}
                    />
                );
            },
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price: any) => {
                if (!price) return '--';
                return formatMoney(price);
            },
        },
        {
            title: '',
            dataIndex: '',
            width: 50,
            align: 'center',
            key: '',
            render: ({ productId }: { productId: any }) => {
                const removeOrder = () => {
                    if (disabled) return;
                    removeProduct(productId._id as string);
                };
                return <CloseCircleFilled style={{ color: 'red' }} onClick={removeOrder} />;
            },
        },
    ];

    return (
        <Table size='small' dataSource={dataSource} columns={columns} bordered pagination={false} />
    );
};

export default TableOrderList;
