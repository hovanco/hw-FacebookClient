import { Avatar, Col, Row, Tooltip } from 'antd';
import { find } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { TextEllipsis } from '../../../components';
import { generateUrlImgFb } from '../../../utils/generate-url-img-fb';
import VideoThumnail from './video-thumnail';

interface Props {
    script: any;
}

const Post = ({ script }: Props) => {
    const pages = useSelector((state: any) => state.fanpage.pages);
    const page = find(pages, (page: any) => page.fbObjectId === script.fbPageId);

    if (!page) return <span>---</span>;

    return (
        <Row gutter={10} align='middle' justify='space-between'>
            <Col>
                <VideoThumnail video={script.video} />
            </Col>

            <Col style={{ flex: 1 }}>
                <div>
                    <a target='_blank' href={page.link}>
                        <Row gutter={5}>
                            <Col>
                                <Avatar
                                    size='small'
                                    src={generateUrlImgFb(page.fbObjectId, page.accessToken)}
                                />
                            </Col>
                            <Col>
                                <Tooltip placement='top' title={page.name}>
                                    <span>
                                        <TextEllipsis width={78}>{page.name}</TextEllipsis>
                                    </span>
                                </Tooltip>
                            </Col>
                        </Row>
                    </a>
                </div>
                <Tooltip
                    placement='top'
                    title={
                        script.type === 0
                            ? 'Áp dụng cho livestream sắp tới'
                            : 'Áp dụng cho livestream đã kết thúc'
                    }
                >
                    <span>
                        <TextEllipsis width={112}>
                            {script.type === 0
                                ? 'Áp dụng cho livestream sắp tới'
                                : 'Áp dụng cho livestream đã kết thúc'}
                        </TextEllipsis>
                    </span>
                </Tooltip>
            </Col>
        </Row>
    );
};

export default Post;
