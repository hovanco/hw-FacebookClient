import {
    CheckCircleFilled,
    CloseCircleFilled,
    PictureOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Avatar, Button, Col, Form, Input, Row, Space, Tag } from 'antd';
import { Store } from 'antd/lib/form/interface';
import { find, isEmpty } from 'lodash';
import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { SendIcon } from '../../../assets/icon';
import { ECreateOrderSyntax } from '../../../collections/livestream-script';
import constants from '../../../constants';
import formatMoney from '../../../utils/format-money';
import { generateUrlImgFb } from '../../../utils/generate-url-img-fb';
import { useNewLiveStream } from './context';
import './demo.less';
import { checkRightSyntax } from './util';

interface IComment {
    id: number;
    text: string;
}

const color = {
    wrong: '#e3404a',
    right: '#0fd186',
};

const AvatarUser = ({ isPage }: { isPage?: boolean }) => {
    const user = useSelector((state: any) => state.auth.user);
    const pages = useSelector((state: any) => state.fanpage.pages);

    const { livestream } = useNewLiveStream();

    const page = find(pages, (page: any) => page.fbObjectId === livestream.fbPageId);

    return (
        <Avatar
            src={isPage ? generateUrlImgFb(page.fbObjectId, page.accessToken) : user.picture}
            icon={<UserOutlined />}
        />
    );
};

interface CommentRowProps {
    comment: {
        text: string;
        isPage?: boolean;
    };
}

const CommentRow: FC<CommentRowProps> = ({ comment }) => {
    return (
        <div
            className='demo-comment'
            style={{
                flexDirection: comment.isPage ? 'row-reverse' : 'row',
                alignItems: 'center',
            }}
        >
            <AvatarUser isPage={comment.isPage} />
            <div
                className='text-comment'
                style={{
                    alignItems: comment.isPage ? 'flex-end' : 'flex-start',
                }}
            >
                <span>{comment.text}</span>
            </div>
        </div>
    );
};

interface BoxCommentProps {
    sendComment: (comment: IComment) => void;
}

const BoxComment: FC<BoxCommentProps> = ({ sendComment }) => {
    const [form] = Form.useForm();
    const onFinish = (values: Store) => {
        if (values.comment.length > 0) {
            sendComment({
                id: Date.now(),
                text: values.comment,
            });
            form.resetFields();
        }
    };

    return (
        <Form onFinish={onFinish} form={form}>
            <Row gutter={15} align='middle'>
                <Col>
                    <AvatarUser />
                </Col>
                <Col style={{ flex: 1 }}>
                    <Form.Item style={{ margin: 0 }} name='comment'>
                        <Input placeholder='Viết bình luận tại đây' className='input' />
                    </Form.Item>
                </Col>
                <Col>
                    <Button
                        htmlType='submit'
                        icon={<SendIcon />}
                        style={{ border: 'none', padding: 0 }}
                    />
                </Col>
            </Row>
        </Form>
    );
};

const WrongSyntax = () => (
    <>
        <div className='status' style={{ color: color.wrong }}>
            <Space>
                <CloseCircleFilled style={{ fontSize: 30 }} />
                <span>Không tạo được đơn hàng</span>
            </Space>
        </div>

        <span>Bình luận chưa đúng cú pháp</span>
    </>
);

interface ProductRowProps {
    product: {
        _id: string;
        images: string[];
        name: string;
        price: number;
    };
}
const ProductRow: FC<ProductRowProps> = ({ product }) => {
    return (
        <div className='product-row'>
            <Row gutter={15} align='middle' justify='space-between'>
                <Col>
                    <Space>
                        <Avatar
                            shape='square'
                            src={`${constants.URL_IMG}${product.images[0]}`}
                            icon={<PictureOutlined />}
                        />
                        <span>{product.name}</span>
                    </Space>
                </Col>

                <Col>{formatMoney(product.price)} đ</Col>
            </Row>
        </div>
    );
};

interface Props { }

const Demo = (props: Props) => {
    const user = useSelector((state: any) => state.auth.user);
    const pages = useSelector((state: any) => state.fanpage.pages);
    const { livestream } = useNewLiveStream();

    const [comments, setComments] = useState<any[]>([]);
    const [lastComment, setLastComment] = useState<IComment>({ id: 1, text: '' });

    const noComment = comments.length === 0;

    const renderComments = () => {
        return comments.map((comment: IComment) => {
            return <CommentRow key={comment.id} comment={comment} />;
        });
    };

    const page = find(pages, (page: any) => page.fbObjectId === livestream.fbPageId);

    const renderSyntax = () => {
        return (
            <Space direction='vertical'>
                {livestream.keywords.map((keyword: any, index: number) => (
                    <div key={index}>
                        <Tag>{keyword.keyword}</Tag>
                        {livestream.syntax === 1 && (
                            <>
                                + <Tag>Số điện thoại</Tag>
                            </>
                        )}
                    </div>
                ))}
            </Space>
        );
    };

    const sendComment = (comment: IComment) => {
        setLastComment(comment);
        setComments((prev) => [...prev, comment]);

        const { valid, phoneNo, products } = checkRightSyntax({
            keywords: livestream.keywords,
            text: comment.text,
            syntax: livestream.syntax,
        });

        const newComment = { id: Date.now() + 1, text: '', isPage: true };

        if (valid) {
            if (livestream.messageTemplate) {
                newComment.text = `${(livestream.messageTemplate || '').replace(
                    /{{Name}}/g,
                    `${user.name}`
                )}`;

                return setComments((prev) => [...prev, newComment]);
            }

            return;
        }

        if (livestream.syntax === ECreateOrderSyntax.Keyword) return;

        if (!phoneNo && !isEmpty(products) && livestream.messageTemplateForWrongPhoneNo) {
            const text = `${livestream.messageTemplateForWrongPhoneNo}`
                .replace(/{{Name}}/g, `${user.name}`)
                .replace(/{{comment livestream}}/g, `${comment.text}`);

            newComment.text = text;
            return setComments((prev) => [...prev, newComment]);
        }

        if (phoneNo && isEmpty(products) && livestream.messageTemplateForWrongKeyword) {
            const text = `${livestream.messageTemplateForWrongKeyword}`
                .replace(/{{Name}}/g, `${user.name}`)
                .replace(/{{comment livestream}}/g, `${comment.text}`);

            newComment.text = text;
            setComments((prev) => [...prev, newComment]);
        }
    };

    const renderStatus = () => {
        const { valid, products } = checkRightSyntax({
            keywords: livestream.keywords,
            text: lastComment.text,
            syntax: livestream.syntax,
        });

        if (!valid) {
            return <WrongSyntax />;
        }

        return (
            <Space direction='vertical' style={{ width: '100%' }} size={15}>
                <div className='status' style={{ color: color.right }}>
                    <Space>
                        <CheckCircleFilled style={{ fontSize: 30 }} />
                        <span>Tạo đơn hàng thành công</span>
                    </Space>
                </div>

                <div className='products'>
                    <Space direction='vertical' style={{ width: '100%' }}>
                        <div>Sản phẩm trong đơn:</div>

                        <div>
                            {products?.map((product: any) => {
                                const productData = { ...product, ...product.productId };

                                return <ProductRow product={productData} key={productData._id} />;
                            })}
                        </div>
                    </Space>
                </div>
            </Space>
        );
    };

    return (
        <div className='demo'>
            <Row>
                <Col style={{ flex: 1 }}>
                    <div>
                        <img
                            style={{ width: '100%' }}
                            src='https://socials.sapoapps.vn/images/demo-img-live.png'
                            alt=''
                        />
                    </div>

                    <div className='process-comment'>
                        <Row gutter={15}>
                            <Col span={noComment ? 24 : 8} style={{ textAlign: 'center' }}>
                                <img
                                    className='demo-gif'
                                    src='https://socials.sapoapps.vn/images/icon-demo-livestream.gif'
                                    alt=''
                                />
                            </Col>
                            {!noComment && (
                                <Col span={16}>
                                    <Space style={{ width: '100%' }} direction='vertical' size={20}>
                                        <div className='process-comment-title'>
                                            Hệ thống đã xử lý xong bình luận của {user.name}
                                        </div>
                                        <div className='text-comment'>{lastComment.text}</div>

                                        <div className='process-comment-order'>
                                            {renderStatus()}
                                        </div>
                                    </Space>
                                </Col>
                            )}
                        </Row>
                    </div>
                </Col>
                <Col style={{ width: '40%' }}>
                    <div className='test-comment'>
                        <div className='page-content'>
                            <Space size={15} style={{ width: '100%' }} direction='vertical'>
                                <Space>
                                    <Avatar
                                        src={generateUrlImgFb(page.fbObjectId, page.accessToken)}
                                    />
                                    <span>{page.name}</span>
                                </Space>
                                <div>
                                    Bạn có thể để lại bình luận theo một trong những cú pháp sau để
                                    đặt mua sản phẩm
                                </div>
                                {renderSyntax()}
                            </Space>
                        </div>

                        <div className='comments-list'>
                            <Space style={{ width: '100%' }} direction='vertical'>
                                {renderComments()}
                            </Space>
                        </div>

                        <div className='comments-editor'>
                            <BoxComment sendComment={sendComment} />
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Demo;
