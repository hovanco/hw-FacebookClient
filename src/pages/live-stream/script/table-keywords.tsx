import React from 'react';
import { Table, Row, Col, Avatar, Space, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import formatMoney from '../../../utils/format-money';
import { PictureFilled } from '@ant-design/icons';
import { TextEllipsis } from '../../../components';
import { IMG_URL } from '../../../configs/vars';

interface Props {
    keywords: any[];
}

const columns: ColumnsType<any> = [
    {
        title: 'STT',
        dataIndex: 'no',
        key: 'no',
        align: 'center',
        width: 50,
    },
    {
        title: 'Từ khóa',
        dataIndex: 'keyword',
        key: 'keyword',
        align: 'center',
        width: 250,
        render: (keyword) => (
            <Tooltip placement='top' title={keyword}>
                <span style={{ lineHeight: 2.21 }}>
                    <TextEllipsis width={218}>{keyword}</TextEllipsis>
                </span>
            </Tooltip>
        ),
    },

    {
        title: 'Sản phẩm',
        dataIndex: 'products',
        key: 'products',
        className: 'custom-padding-col',
        align: 'center',
        render: (products) => {
            let children = products.map((product: any, index: number) => {
                let productData =
                    typeof product.productId === 'object' ? product.productId : product;

                return (
                    <Row
                        key={`${productData._id}_${index}`}
                        justify='space-between'
                        align='middle'
                        style={{ marginBottom: 5 }}
                    >
                        <Col>
                            <Space>
                                {!productData.images || productData.images.length === 0 ? (
                                    <Avatar size='large' icon={<PictureFilled />} shape='square' />
                                ) : (
                                    <Avatar
                                        size='large'
                                        src={`${IMG_URL}${productData.images[0]}`}
                                        shape='square'
                                    />
                                )}
                                <div style={{ textAlign: 'left' }}>
                                    <span className='product-name'>
                                        <TextEllipsis width={400}>{productData.name}</TextEllipsis>
                                    </span>
                                    <div className='product-code'>{productData.code || ''}</div>
                                </div>
                            </Space>
                        </Col>
                        <Col style={{ lineHeight: 2.21 }}>{formatMoney(product.price)}đ</Col>
                    </Row>
                );
            });

            return {
                children,
                props: {
                    colSpan: 2,
                },
            };
        },
    },

    {
        title: 'Đơn giá',
        dataIndex: 'products',
        key: 'products',
        align: 'right',
        render: () => ({
            props: {
                colSpan: 0,
            },
        }),
    },
];

const TableKeywords = (props: Props) => {
    const dataSource = props.keywords.map((keyword: any, index: number) => ({
        ...keyword,
        no: index + 1,
        key: index + 1,
    }));

    return (
        <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            rowClassName={(record, index) =>
                index % 2 === 0 ? 'table-row-dark' : 'table-row-light'
            }
        />
    );
};

export default TableKeywords;
