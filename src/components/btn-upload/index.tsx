import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'antd';
import { uploadImagesRequest } from '../../api/upload-api';
import './style.less';

interface Props {
    loading?: boolean;
    title?: string;
    multiple?: boolean;
    handleUpload?: (arg: any) => void;
}

const BtnUpload: FC<Props> = ({
    title = 'Upload ảnh',
    multiple = false,
    handleUpload,
    loading,
}): JSX.Element => {
    return (
        <div className='btn-upload'>
            <Button type='primary' danger loading={loading}>
                {title}
            </Button>
            <input type='file' accept='image/*' onChange={handleUpload} multiple={multiple} />
        </div>
    );
};

export default BtnUpload;
