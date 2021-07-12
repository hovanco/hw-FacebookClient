import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import React from 'react';
import AddKeyword from './add-keyword';
import { size } from './index';

interface Props {}

const EmptyKeyword = (props: Props) => {
    return (
        <div style={{ padding: '15px 30px 30px' }}>
            <Row gutter={15}>
                <Col>
                    <div style={{ marginBottom: 15 }}>Bước 1: Chọn sản phẩm muốn bán </div>
                    <div style={{ marginBottom: 15 }}>
                        Bước 2: Tạo từ khóa đặt hàng cho sản phẩm
                    </div>

                    <p className='secondary-paragraph' style={{ margin: '15px 0' }}>
                        Ví dụ: Bạn muốn bán sản phẩm “SON MAC” thì cần chọn sản phẩm đó, sau đó tạo
                        từ khóa đặt hàng tương ứng là “MAC”. Khi khách hàng xem livestream để lại
                        bình luận có chứa từ “ MAC”, hệ thống sẽ tự động tạo đơn hàng với sản phẩm
                        là “SON MAC”
                    </p>

                    <AddKeyword>
                        <Button type='primary' size={size} icon={<PlusOutlined />}>
                            Thêm mẫu từ khóa đặt hàng
                        </Button>
                    </AddKeyword>
                </Col>
            </Row>
        </div>
    );
};

export default EmptyKeyword;
