import React from 'react';
import { Card, Row, Col } from 'antd';
import moment from 'moment';

interface Props {
    active?: boolean;
    video: any;
    onClick: (videoId: string) => void;
}

const Video = ({ video, active = false, onClick }: Props) => {
    const className = active ? 'video active' : 'video';

    const handleOnClick = () => {
        onClick(video.id);
    };

    return (
        <div className={className} onClick={handleOnClick}>
            <Row gutter={15}>
                <Col>
                    <div className='img'>
                        <img src={video.picture} alt={video.title} />
                    </div>
                </Col>
                <Col>
                    <div>{video.title}</div>
                    <span>{`kết thúc trực tiếp lúc ${moment(video.updated_time).format(
                        'DD/MM/YYYY HH:mm'
                    )}`}</span>
                </Col>
            </Row>
        </div>
    );
};

export default Video;
