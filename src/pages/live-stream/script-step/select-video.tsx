import { message, Modal, Radio } from 'antd';
import React, { useState } from 'react';
import useModal from '../../../hooks/use-modal';
import GetVideoForm from './get-video-form';
import { size } from './index';
import Videos from './videos';
import { useNewLiveStream } from './context';

interface Props {}

const SelectVideo = (props: Props) => {
    const { setVideoId } = useNewLiveStream();
    const [select_type, setSelectType] = useState(0);
    const [videoId, handleSetVideoId] = useState<string | undefined>(undefined);

    const { visible, toggle } = useModal();

    const changeSelectType = (e: any) => {
        setSelectType(parseInt(e.target.value));
        handleSetVideoId(undefined);
    };

    const selectVideo = (video: string) => {
        handleSetVideoId(video);
    };

    const applyVideo = () => {
        if (videoId) {
            setVideoId(videoId);
            toggle();
        } else {
            message.error('Chưa chọn video livestream');
        }
    };

    return (
        <div>
            <a onClick={toggle}>Chọn video</a>
            <Modal
                visible={visible}
                onCancel={toggle}
                okButtonProps={{
                    size,
                }}
                cancelButtonProps={{
                    size,
                }}
                okText='Áp dụng'
                width={650}
                title={'Lựa chọn video livestream đã kết thúc cho kịch bản'}
                onOk={applyVideo}
            >
                <div style={{ display: 'grid', gridGap: 10 }}>
                    <div>
                        <Radio checked={select_type === 0} value={0} onChange={changeSelectType}>
                            Tìm video livestream theo đường dẫn
                        </Radio>
                        {select_type === 0 && (
                            <GetVideoForm selectVideo={selectVideo} videoId={videoId} />
                        )}
                    </div>

                    <div>
                        <Radio checked={select_type === 1} value={1} onChange={changeSelectType}>
                            Lựa chọn video livestream của page (50 video livestream gần nhất)
                        </Radio>
                        {select_type === 1 && (
                            <div style={{ margin: '7px 0px 15px 23px' }}>
                                <Videos selectVideo={selectVideo} videoId={videoId} />
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default SelectVideo;
