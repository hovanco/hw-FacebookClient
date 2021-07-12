import { Card, Col, Row, Space, Switch } from 'antd';
import React from 'react';
import CommentTemplate from './comment-template';
import { useNewLiveStream } from './context';
import MessageTemplate from './message-template';
import MessageTemplateWrongKeyword from './message-template-wrong-keyword';
import MessageTemplateWrongPhone from './message-template-wrong-phone';

interface Props {}

const SetupReply = (props: Props) => {
    const {
        livestream,
        setAutoReplyIfCommentIsCorrect,
        setAutoReplyIfCommentIsIncorrect,
        setAutoHideComments,
    } = useNewLiveStream();

    return (
        <Space direction='vertical' style={{ width: '100%' }} size={20}>
            <Row justify='space-between' gutter={20}>
                <Col style={{ flex: 1 }}>
                    <div className='label_form'>
                        Gửi trả lời tự động khi khách hàng bình luận đúng cú pháp và đơn hàng được
                        tạo
                    </div>
                </Col>
                <Col>
                    <Switch
                        checked={livestream.autoReplyIfCommentIsCorrect}
                        onChange={setAutoReplyIfCommentIsCorrect}
                    />
                </Col>

                {livestream.autoReplyIfCommentIsCorrect && (
                    <Col span={24} style={{ marginTop: 10 }}>
                        <Card bodyStyle={{ padding: 15 }}>
                            <CommentTemplate />

                            <MessageTemplate />
                        </Card>
                    </Col>
                )}
            </Row>

            <Row justify='space-between' gutter={20}>
                <Col style={{ flex: 1 }}>
                    <div className='label_form'>
                        Gửi trả lời tự động khi khách hàng bình luận chưa đúng cú pháp đặt hàng
                    </div>
                </Col>
                <Col>
                    <Switch
                        disabled={livestream.syntax === 0}
                        checked={livestream.autoReplyIfCommentIsIncorrect}
                        onChange={setAutoReplyIfCommentIsIncorrect}
                    />
                </Col>

                {livestream.syntax === 0 && (
                    <Col span={24}>
                        <div style={{ marginTop: 15 }} className='secondary-paragraph'>
                            Chức năng này chỉ khả dụng cho trường hợp cú pháp đặt hàng bao gồm Từ
                            khóa đặt hàng và Số điện thoại
                        </div>
                    </Col>
                )}
                {livestream.autoReplyIfCommentIsIncorrect && (
                    <Col span={24} style={{ marginTop: 10 }}>
                        <Card bodyStyle={{ padding: 15 }}>
                            <MessageTemplateWrongKeyword />

                            <MessageTemplateWrongPhone />
                        </Card>
                    </Col>
                )}
            </Row>

            <Row justify='space-between' gutter={20}>
                <Col style={{ flex: 1 }}>
                    <div className='label_form'>Tự động ẩn bình luận khách hàng</div>
                </Col>
                <Col>
                    <Switch checked={livestream.autoHideComments} onChange={setAutoHideComments} />
                </Col>
            </Row>
        </Space>
    );
};

export default SetupReply;
