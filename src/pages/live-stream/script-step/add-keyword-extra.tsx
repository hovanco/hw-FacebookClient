import React from 'react';

import AddKeyword from './add-keyword';
import { PlusOutlined } from '@ant-design/icons';
import { useNewLiveStream } from './context';

interface Props {}

const AddKeywordExtra = (props: Props) => {
    const { livestream } = useNewLiveStream();

    if (livestream.keywords.length === 0) return null;
    return (
        <AddKeyword>
            <a>
                <PlusOutlined /> Thêm mẫu
            </a>
        </AddKeyword>
    );
};

export default AddKeywordExtra;
