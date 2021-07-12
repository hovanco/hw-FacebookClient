import { Card, Col, Divider, Row, Space, Switch } from 'antd';
import moment from 'moment';
import React, { FC } from 'react';
import { ILivestreamScript } from '../../../collections/livestream-script';
import PageApply from './page-apply';
import ScriptAction from './script-action';
import './script-detail.less';
import TableKeywords from './table-keywords';

interface Props {
    script: ILivestreamScript;
}

const ScriptDetail: FC<Props> = ({ script }) => {
    return (
        <Row gutter={[0, 30]}>
            <Col span={24}>
                <Card title='Thông tin chi tiết' extra={<ScriptAction script={script} />}>
                    <Space direction='vertical' size='middle' style={{ width: '100%' }}>
                        <Row>
                            <Col span={6}>Video livestream lựa chọn</Col>
                            <Col span={18}>
                                {script.type === 0 ? (
                                    'Áp dụng cho livestream sắp tới'
                                ) : script.video ? (
                                    <Space>
                                        <img
                                            style={{
                                                width: 120,
                                                height: 70,
                                                objectFit: 'cover',
                                                float: 'left',
                                                marginRight: 10,
                                                borderRadius: 4,
                                            }}
                                            src={script.video.picture}
                                            alt={script.video.title}
                                        />
                                        <div
                                            className='secondary-paragraph'
                                            style={{ fontSize: 14 }}
                                        >
                                            <div>{`Bắt đầu lúc ${moment(script.createdAt).format(
                                                'DD/MM/YYYY HH:mm'
                                            )}`}</div>
                                            <div>{`Kết thúc lúc ${moment(script.updatedAt).format(
                                                'DD/MM/YYYY HH:mm'
                                            )}`}</div>
                                        </div>
                                    </Space>
                                ) : (
                                    'Không có dữ liệu video livestream'
                                )}
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>Trang áp dụng</Col>
                            <Col span={18}>
                                <PageApply fbPageId={script.fbPageId} />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>Ngày tạo</Col>
                            <Col span={18}>
                                {moment(script.createdAt).format('DD/MM/YYYY HH:mm')}
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>Cập nhật cuối</Col>
                            <Col span={18}>
                                {moment(script.updatedAt).format('DD/MM/YYYY HH:mm')}
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>Điều kiện tạo đơn hàng</Col>
                            <Col span={18}>
                                {script.syntax === 0
                                    ? 'Chứa mã sản phẩm'
                                    : 'Chứa mã sản phẩm, chứa số điện thoại'}
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>Thời điểm tạo đơn</Col>
                            <Col span={18}>
                                {script.orderCreationType === 0 ? (
                                    <span>
                                        Ngay sau khi khách hàng bình luận đúng cú pháp đặt đơn (Chỉ
                                        tạo 1 đơn hàng)
                                        <br />
                                        Gộp các bình luận đúng cú pháp và chỉ tạo 1 đơn hàng duy
                                        nhất
                                    </span>
                                ) : script.orderCreationType === 1 ? (
                                    <span>
                                        Ngay sau khi khách hàng bình luận đúng cú pháp đặt đơn{' '}
                                        <br />
                                        Mỗi bình luận đúng cú pháp tạo 1 đơn hàng
                                    </span>
                                ) : (
                                    <span>
                                        Sau khi livestream kết thúc
                                        <br />
                                        Gộp các bình luận đúng cú pháp của 1 khách hàng để tạo 1 đơn
                                        hàng
                                    </span>
                                )}{' '}
                            </Col>
                        </Row>
                    </Space>
                </Card>
            </Col>

            <Col span={24}>
                <Card title='Mẫu nội dung' className='content-frame'>
                    <TableKeywords keywords={script.keywords} />
                </Card>
            </Col>

            {(script.autoReplyIfCommentIsCorrect || script.autoReplyIfCommentIsIncorrect) && (
                <Col span={24}>
                    <Card title='Kịch bản trả lời tự động' className='script-auto-reply'>
                        {script.autoReplyIfCommentIsCorrect && (
                            <>
                                <p className='title'>
                                    Kịch bản khi bình luận đúng cú pháp và đơn hàng được tạo
                                </p>
                                <Row gutter={[15, 10]}>
                                    <Col span={7}>Nội dung bình luận phản hồi</Col>
                                    <Col span={17}>{script.commentTemplate}</Col>
                                </Row>
                                <Row gutter={15}>
                                    <Col span={7}>Nội dung tin nhắn phản hồi</Col>
                                    <Col span={17}>{script.messageTemplate}</Col>
                                </Row>
                                <Divider />
                            </>
                        )}

                        {script.autoReplyIfCommentIsIncorrect && (
                            <>
                                <p className='title'>
                                    Kịch bản nhắn tin gửi cho khách khi bình luận chưa đúng cú pháp
                                </p>
                                <Row gutter={[15, 10]}>
                                    <Col span={7}>Khi bình luận đúng từ khóa, thiếu SĐT</Col>
                                    <Col span={17}>{script.messageTemplateForWrongPhoneNo}</Col>
                                </Row>
                                <Row gutter={15}>
                                    <Col span={7}>Khi bình luận có SĐT, sai từ khóa</Col>
                                    <Col span={17}>{script.messageTemplateForWrongKeyword}</Col>
                                </Row>
                                <Divider />
                            </>
                        )}

                        <Row gutter={15}>
                            <Col span={7}>Tự động ẩn bình luận khách hàng</Col>
                            <Col span={17}>
                                <Switch checked={script.autoHideComments} disabled />
                            </Col>
                        </Row>
                    </Card>
                </Col>
            )}
        </Row>
    );
};

export default ScriptDetail;
