import React from 'react';
import { useNotification } from '../../customer/notfication-context';

import { Card, Col, Row } from 'antd';
import { Element } from 'react-scroll';
import { BaseLayout } from '../../../layout';
import AddKeywordExtra from './add-keyword-extra';
import BtnDemo from './btn-demo';
import BtnSave from './btn-save';
import CardTitle from './card-title';
import { NewLiveStreamProvider } from './context';
import NoteCreateOrder from './note-create-order';
import SetupCreateOrder from './setup-create-order';
import SetupKeyWord from './setup-keyword';
import SetupLivestream from './setup-livestream';
import SetupReply from './setup-reply';
import StepNav from './step-nav';
import HeaderRight from '../../../components/header-customer/header-right';

import './index.less';

interface Props {
    script?: any;
}

export const size = 'large';

export const radioStyle = {
    display: 'flex',
    lineHeight: '16px',
};

const ScriptNew = (props: Props) => {
    const { title } = useNotification();
    const text = props.script ? props.script.name : 'Thêm mới kịch bản';
    const title_page = `${title} ${text}`;
    return (
        <NewLiveStreamProvider script={props.script}>
            <BaseLayout title={title_page}>
                <HeaderRight
                    title={
                        props.script
                            ? 'Chỉnh sửa kịch bản livestream'
                            : 'Thêm mới kịch bản livestream'
                    }
                />
                <div style={{ overflow: 'hidden' }}>
                    <div className='heading'>
                        <Row align='middle' justify='end'>
                            <Col>
                                <StepNav />
                            </Col>
                        </Row>
                    </div>

                    <div className='content script-step-content' id='containerElement'>
                        <div
                            className='container'
                            style={{ maxWidth: 1045, margin: 'auto', paddingBottom: 50 }}
                        >
                            <div>
                                <Element name='0' className='scroll-element'>
                                    <Row gutter={30}>
                                        <Col span={16}>
                                            <Card
                                                title='1. Chọn trang livestream và đặt tên kịch bản'
                                                bodyStyle={{ padding: '15px 30px' }}
                                            >
                                                <SetupLivestream />
                                            </Card>
                                        </Col>
                                        <Col span={8}>
                                            <Card
                                                type='inner'
                                                className='card-help'
                                                title={
                                                    <CardTitle title='Lựa chọn video livestream như nào?' />
                                                }
                                            >
                                                <p>
                                                    Tại thời điểm tạo kịch bản, nếu trang đang có
                                                    video livestream, bạn có hai cách sử dụng như
                                                    sau:
                                                </p>
                                                <div className='list-number-prefix'>
                                                    <p>
                                                        Chọn một video livestream: Sau khi lưu lại,
                                                        kịch bản sẽ được áp dụng ngay lập tức cho
                                                        video đó.
                                                    </p>
                                                    <p>
                                                        Sử dụng cho livestream sắp tới: Kịch bản sẽ
                                                        được lưu lại ở trạng thái “ Chưa sử dụng “,
                                                        và sẽ tự động áp dụng cho video livestream
                                                        tiếp theo của trang Lưu ý: Mặc định, tại
                                                        thời điểm tạo kịch bản mà trang không có
                                                        video livestream nào, kịch bản sẽ được áp
                                                        dụng cho video livestream tiếp theo.
                                                    </p>
                                                    <p>
                                                        Sử dụng cho livestream đã kết thúc: Sau khi
                                                        lưu lại và kích hoạt, kịch bản sẽ thực hiện
                                                        tự động tạo đơn hàng cho các bình luận của
                                                        video livestream từ lúc bắt đầu livestream
                                                        đến thời điểm kịch bản áp dụng.
                                                    </p>
                                                </div>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Element>

                                <Element name='1' className='scroll-element'>
                                    <Row gutter={30}>
                                        <Col span={16}>
                                            <Card
                                                title='2. Tạo từ khóa đặt hàng tương ứng với sản phẩm'
                                                extra={<AddKeywordExtra />}
                                                bodyStyle={{
                                                    padding: 0,
                                                    minHeight: 235,
                                                }}
                                            >
                                                <SetupKeyWord />
                                            </Card>
                                        </Col>
                                        <Col span={8}>
                                            <Card
                                                type='inner'
                                                className='card-help'
                                                title={<CardTitle title='Từ khóa đặt hàng' />}
                                            >
                                                <p>
                                                    Hệ thống không phân biệt các từ khóa viết hoa,
                                                    viết thường, có dấu, không dấu.
                                                </p>
                                                <p>
                                                    Ví dụ: với từ khóa "QUẦN JEAN", những bình luận
                                                    như "Quần jean", "quanjean", "QUAN jean" đều
                                                    được coi là đúng cú pháp.
                                                </p>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Element>
                                <Element name='2' className='scroll-element'>
                                    <Row gutter={30}>
                                        <Col span={16}>
                                            <Card
                                                title='3. Tạo cú pháp để tạo đơn tự động'
                                                bodyStyle={{ padding: '15px 30px' }}
                                            >
                                                <SetupCreateOrder />
                                            </Card>
                                        </Col>
                                        <Col span={8}>
                                            <NoteCreateOrder />
                                        </Col>
                                    </Row>
                                </Element>

                                <Element name='3' className='scroll-element'>
                                    <Row gutter={30}>
                                        <Col span={16}>
                                            <Card
                                                title='4. Kịch bản trả lời tự động'
                                                bodyStyle={{ padding: '15px 30px' }}
                                            >
                                                <SetupReply />
                                            </Card>
                                        </Col>
                                        <Col span={8}>
                                            <Card
                                                type='inner'
                                                className='card-help'
                                                title={<CardTitle title='Trả lời tự động' />}
                                            >
                                                <p>
                                                    Trả lời tự động Sau 1 phút từ khi khách hàng để
                                                    lại bình luận, hệ thống sẽ trả lời bình luận của
                                                    khách và gửi tin nhắn cho khách hàng theo nội
                                                    dung bạn thiết lập.
                                                </p>

                                                <p>
                                                    Bạn có thể thiết lập 2 mẫu nội dung trả lời tự
                                                    động riêng biệt cho từng trường hợp khách hàng
                                                    bình luận đúng cú pháp hoặc sai cú pháp đặt
                                                    hàng.
                                                </p>

                                                <p>
                                                    {'{{Name}}'} Chèn tên khách hàng dưới dạng
                                                    "mentions"
                                                </p>
                                                <p>
                                                    {'{{comment livestream}}'} Chèn nội dung của
                                                    bình luận
                                                </p>

                                                <p className='secondary-paragraph'>
                                                    <span style={{ color: '#f53d2d' }}>
                                                        Lưu ý:{' '}
                                                    </span>
                                                    Nếu bạn không nhập vào nội dung, hệ thống sẽ
                                                    không thực hiện việc trả lời tự động
                                                </p>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Element>

                                <Element
                                    name='4'
                                    className='scroll-element scroll-element-last-item'
                                >
                                    <Row gutter={15} justify='end'>
                                        <Col>
                                            <BtnDemo />
                                        </Col>
                                        <Col>
                                            <BtnSave
                                                type='primary'
                                                title='Lưu'
                                                script={props.script}
                                            />
                                        </Col>
                                        <Col>
                                            <BtnSave
                                                title=' Lưu và Kích hoạt'
                                                active
                                                script={props.script}
                                            />
                                        </Col>
                                    </Row>
                                </Element>
                            </div>
                        </div>
                    </div>
                </div>
            </BaseLayout>
        </NewLiveStreamProvider>
    );
};

export default ScriptNew;
