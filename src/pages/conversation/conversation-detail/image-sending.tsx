import React, { FC } from 'react';
import { IImage } from '../../../collections/image';
import { IMG_URL } from '../../../configs/vars';

interface Props {
    image: IImage;
}

const ImageSending: FC<Props> = ({ image }) => {
    const url = `${IMG_URL}${image.key}`;
    return (
        <div className='item me'>
            <div className='item-inner img'>
                <img src={url} alt={image.name} />
            </div>
        </div>
    );
};

export default ImageSending;
