import { Button, Col, Row } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import livestream_empty from '../images/livestream-empty.svg';
import { Card } from 'antd';

interface Props {}

const EmptyLivestream = (props: Props) => {
    return (
        <div className='empty-livestream'>
            <Row gutter={30}>
                <Col md={12} xs={24}>
                    <Card type='inner' title='Bạn chưa có kịch bản livestream nào!'>
                        <span className='lead-to-step-text'>
                            Tìm hiểu 3 bước dưới đây để bắt đầu tạo và sử dụng kịch bản bán hàng
                            livestream trên Facebook đầu tiên bạn nhé
                        </span>

                        <ul className='steps'>
                            <li>
                                <div className='step-number'>1</div>
                                <div className='step-content'>
                                    Tạo kịch bản livestream và kích hoạt
                                </div>
                            </li>
                            <li>
                                <div className='step-number'>2</div>
                                <div className='step-content'>
                                    Tiến hành phát livestream trên trang Facebook của bạn
                                </div>
                            </li>
                            <li>
                                <div className='step-number'>3</div>
                                <div className='step-content'>
                                    Xem thống kê bình luận, đơn hàng theo từng video livestream
                                </div>
                            </li>
                        </ul>

                        <Link to='/customer/livestream/new' className='make-new-script-link'>
                            <Button size='large' type='primary'>
                                Tạo kịch bản bán hàng livestream
                            </Button>
                        </Link>

                        <div className='script-guide-lead'>
                            <span className='script-guide-lead-text'>
                                Xem hướng dẫn chi tiết về tính năng này{' '}
                                <a href='https://insa.app/kham-pha/huong-dan-ban-hang-livestream' target='_blank' className='script-guide-lead-link'>
                                    tại đây
                                </a>
                            </span>
                        </div>
                    </Card>
                </Col>
                <Col md={12} xs={24}>
                    <img src={livestream_empty} alt='Bạn chưa có kịch bản livestream nào!' />
                </Col>
            </Row>
        </div>
    );
};

export default EmptyLivestream;
