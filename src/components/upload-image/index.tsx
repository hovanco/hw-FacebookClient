import { PlusOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import React, { FC } from 'react';
import { IImage } from '../../collections/image';
import { IMG_URL } from '../../configs/vars';
import useModal from '../../hooks/use-modal';
import ImgsLibrary from '../../pages/conversation/conversation-detail/imgs-library';
import './style.less';

interface Props {
    size?: number;
    label?: string;
    img?: string;
    handleImages?: Function;
    imagesSeleted?: any[];
}

const UploadImage: FC<Props> = ({
    size = 100,
    label,
    img,
    handleImages = () => {},
    imagesSeleted = [],
}): JSX.Element => {
    const { visible, toggle } = useModal();

    const styleFrame = {
        width: size,
        height: size,
        backgroundImage: img ? `url(${IMG_URL}${img})` : '',
    };

    const handleImageSelect = (images: IImage[]) => {
        handleImages(images);
    };

    return (
        <div className='upload-img'>
            {label && <div className='label'>{label}</div>}

            <div className='frame' onClick={toggle} style={styleFrame}>
                {!img && <PlusOutlined />}
            </div>

            <Modal
                footer={null}
                visible={visible}
                onCancel={toggle}
                onOk={toggle}
                bodyStyle={{ padding: 0 }}
                width={900}
                closeIcon={null}
                closable={false}
                destroyOnClose
            >
                <ImgsLibrary
                    toggle={toggle}
                    handleImageSelect={handleImageSelect}
                    imagesSeleted={imagesSeleted}
                />
            </Modal>
        </div>
    );
};

export default UploadImage;
