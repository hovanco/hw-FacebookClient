import { Col, Form, Input, Radio, Row, Select, Avatar } from 'antd';
import { map } from 'lodash';
import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { useNewLiveStream } from './context';
import { radioStyle, size } from './index';
import SelectVideo from './select-video';
import { PictureOutlined } from '@ant-design/icons';
import { generateUrlImgFb } from '../../../utils/generate-url-img-fb';

interface Props {}

const SetupLivestream = (props: Props) => {
    const { setFbPageId, setNameLiveStream, setTypeLivestream, livestream } = useNewLiveStream();

    const pages = useSelector((state: any) => state.fanpage.pages);
    const changUseLivestream = (e: any) => {
        setTypeLivestream(e.target.value);
    };

    const changeNameLivestream = (e: any) => {
        setNameLiveStream(e.target.value);
    };

    const selectPage = (value: string) => {
        setFbPageId(value);
    };

    return (
        <div>
            <Form.Item
                label={<span className='label_form'>Chọn trang livestream</span>}
                labelCol={{ span: 24 }}
            >
                <Select size={size} value={livestream.fbPageId} onChange={selectPage}>
                    {map(pages, (page: any) => (
                        <Select.Option key={page.fbObjectId} value={page.fbObjectId}>
                            <Avatar
                                size={25}
                                src={generateUrlImgFb(page.fbObjectId, page.accessToken)}
                            />
                            <span style={{ marginLeft: 10, fontSize: 14, color: '#717171' }}>
                                {page.name}
                            </span>
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label={
                    <span className='label_form'>
                        Lựa chọn video livestream áp dụng cho kịch bản này
                    </span>
                }
                labelCol={{ span: 24 }}
            >
                <Row justify='space-between' align='bottom'>
                    <Col>
                        <Radio.Group value={livestream.type} onChange={changUseLivestream}>
                            <Radio style={radioStyle} value={0}>
                                Sử dụng cho video livestream sắp tới
                            </Radio>

                            <Radio style={{ ...radioStyle, marginTop: 15 }} value={1}>
                                Sử dụng cho video livestream đã kết thúc
                            </Radio>
                        </Radio.Group>
                    </Col>
                    <Col>{livestream.type === 1 && <SelectVideo />}</Col>
                </Row>
            </Form.Item>

            <Form.Item
                label={<span className='label_form'>Tên kịch bản</span>}
                labelCol={{ span: 24 }}
            >
                <Input
                    size={size}
                    value={livestream.name}
                    onChange={changeNameLivestream}
                    autoFocus
                />
            </Form.Item>
        </div>
    );
};

export default memo(SetupLivestream);
