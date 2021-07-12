import { Button, Col, Input, message, Row } from 'antd';
import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import livestreamApi from '../../../api/livestream-api';
import { useNewLiveStream } from './context';
import Video from './video';

interface Props {
    selectVideo: (videoId: string) => void;
    videoId?: string;
}

const size = 'large';

const GetVideoForm = (props: Props) => {
    const { livestream } = useNewLiveStream();
    const store = useSelector((state: any) => state.store.store);
    const [url_livestream, setUrlLiveStream] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [video, setVideo] = useState<any | null>(null);

    const changeUrlLivestream = (e: any) => {
        setUrlLiveStream(e.target.value);
    };

    const requestVideo = async () => {
        const arrText: string[] = (url_livestream as string).split('/');

        const videoId = arrText[arrText?.length - 1];

        if (livestream && livestream.fbPageId) {
            try {
                setLoading(true);
                const response = await livestreamApi.getVideo({
                    storeId: store._id,
                    fbPageId: livestream.fbPageId || '',
                    videoId,
                });

                setVideo(response);
                setLoading(false);
            } catch (error) {
                message.error('Lỗi tải video');
                setLoading(false);
            }
        }
    };

    const handleSelectVideo = () => {
        if (video && video.id) {
            props.selectVideo(video.id);
        }
    };

    const isValidUrl = useMemo(() => {
        if (url_livestream && url_livestream.length > 0) {
            const textArray: string[] = url_livestream.split('/');

            const videoId: string = textArray[textArray.length - 1];

            return /^[0-9]+$/.test(videoId);
        }

        return false;
    }, [url_livestream]);

    return (
        <div style={{ margin: '7px 0px 15px 23px' }}>
            <Row justify='space-between' gutter={15}>
                <Col style={{ flex: 1 }}>
                    <Input
                        value={url_livestream}
                        onChange={changeUrlLivestream}
                        size={size}
                        placeholder='Nhập đường dẫn của video livestream trên page'
                    />
                </Col>
                <Col>
                    <Button
                        type='primary'
                        size={size}
                        loading={loading}
                        disabled={loading || !isValidUrl}
                        onClick={requestVideo}
                    >
                        Chọn
                    </Button>
                </Col>
            </Row>
            <div
                className='secondary-paragraph'
                style={
                    url_livestream && url_livestream.length > 0 && !isValidUrl
                        ? { color: '#f05050' }
                        : {}
                }
            >
                Ví dụ: https://www.facebook.com/104815174675752/videos/328935001784695
            </div>

            {video && (
                <div className='videos' style={{ marginTop: 15 }}>
                    <Video
                        video={video}
                        onClick={handleSelectVideo}
                        active={video.id === props.videoId}
                    />
                </div>
            )}
        </div>
    );
};

export default GetVideoForm;
