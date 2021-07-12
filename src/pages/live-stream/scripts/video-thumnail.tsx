import { QuestionOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React, { FC } from 'react';
import { IFBVideo } from '../../../collections/livestream-script';

interface Props {
    video?: IFBVideo;
    style?: any;
}

const VideoThumnail: FC<Props> = ({ video, style }) => {
    if (!video) {
        return (
            <div className='thumnail-livestream' style={{ ...style }}>
                <QuestionOutlined />
            </div>
        );
    }

    return (
        <Tooltip title={video.title}>
            <a
                className='thumnail-livestream'
                style={{ ...style }}
                target='_blank'
                href={`https://www.facebook.com/${video.id}`}
            >
                <img src={video.picture} alt={video.title} />
            </a>
        </Tooltip>
    );
};

export default VideoThumnail;
