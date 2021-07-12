import { Empty } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import livestreamApi from '../../../api/livestream-api';
import { Loading } from '../../../components';
import { useNewLiveStream } from './context';
import Video from './video';

interface Props {
    videoId?: string;
    selectVideo: (videoId: string) => void;
}

const Videos = (props: Props) => {
    const { livestream } = useNewLiveStream();
    const store = useSelector((state: any) => state.store.store);
    const [loading, setLoading] = useState(true);
    const [videos, setVideos] = useState([]);

    const handleSelectVideo = (videoId: string) => {
        props.selectVideo(videoId);
    };

    useEffect(() => {
        async function loadVideos(fbPageId: any) {
            try {
                setLoading(true);
                const response = await livestreamApi.getVideos({
                    storeId: store._id,
                    fbPageId,
                });
                setVideos(response);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }

        if (livestream.fbPageId) {
            loadVideos(livestream.fbPageId);
        }
    }, []);

    if (loading) return <Loading />;
    if (videos.length === 0) return <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />;

    return (
        <div className='videos'>
            {videos.map((video: any) => (
                <Video
                    key={video.id}
                    video={video}
                    active={video.id === props.videoId}
                    onClick={handleSelectVideo}
                />
            ))}
        </div>
    );
};

export default Videos;
