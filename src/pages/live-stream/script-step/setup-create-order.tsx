import React from 'react';
import { Form, Checkbox, Row, Col, Radio } from 'antd';

import { radioStyle } from './index';
import { useNewLiveStream } from './context';

interface Props {}

const SetupCreateOrder = (props: Props) => {
    const { livestream, setSyntaxWithPhone, setOrderCreationType } = useNewLiveStream();

    const changeSyntaxWithPhone = (e: any) => {
        setSyntaxWithPhone(e.target.value ? 0 : 1);
    };

    const changeOrderCreationType = (e: any) => {
        setOrderCreationType(e.target.value);
    };

    return (
        <div>
            <Form.Item
                label={<span className='label_form'>Cú pháp đặt hàng bao gồm</span>}
                labelCol={{ span: 24 }}
            >
                <Row>
                    <Col span={24}>
                        <Checkbox indeterminate checked>
                            Từ khóa đặt hàng
                        </Checkbox>
                    </Col>
                    <Col span={24} style={{ marginTop: 15 }}>
                        <Checkbox
                            indeterminate={livestream.syntax === 1}
                            checked={livestream.syntax === 1}
                            onChange={changeSyntaxWithPhone}
                            value={livestream.syntax === 1}
                        >
                            Số điện thoại
                        </Checkbox>
                    </Col>
                </Row>
            </Form.Item>

            <Form.Item
                label={<span className='label_form'>Lựa chọn thời điểm để lên đơn tự động</span>}
            >
                <Radio.Group
                    value={livestream.type === 1 ? 2 : livestream.orderCreationType}
                    onChange={changeOrderCreationType}
                >
                    <Radio style={radioStyle} disabled={livestream.type === 1} value={0}>
                        Ngay sau khi khách hàng bình luận đúng cú pháp đặt đơn (Chỉ tạo 1 đơn hàng)
                    </Radio>
                    <div className='secondary-paragraph radio-option-explain'>
                        Gộp các bình luận đúng cú pháp và chỉ tạo 1 đơn hàng duy nhất
                    </div>
                    <Radio
                        style={{ ...radioStyle, marginTop: 15 }}
                        value={1}
                        disabled={livestream.type === 1}
                    >
                        Ngay sau khi khách hàng bình luận đúng cú pháp đặt đơn
                    </Radio>
                    <div className='secondary-paragraph radio-option-explain'>
                        Mỗi bình luận đúng cú pháp tạo 1 đơn hàng
                    </div>

                    <Radio style={{ ...radioStyle, marginTop: 15 }} value={2}>
                        Sau khi livestream kết thúc
                    </Radio>
                    <div className='secondary-paragraph radio-option-explain'>
                        Gộp các bình luận đúng cú pháp của 1 khách hàng để tạo 1 đơn hàng
                    </div>
                </Radio.Group>
            </Form.Item>
        </div>
    );
};

export default SetupCreateOrder;
