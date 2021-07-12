import { Input } from 'antd';
import { debounce } from 'lodash';
import React, { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { searchImage, changTextSearch } from '../../../reducers/imagesState/imagesAction';

interface Props {
    gallery?: any;
}

const SearchImage: FC<Props> = ({ gallery }): JSX.Element => {
    const [loading, setLoading] = useState(false);
    // const [text, setText] = useState();
    const dispatch = useDispatch();
    const text_search = useSelector((state: any) => state.images.text_search);

    const onChangeSearchText = (e: any) => {
        dispatch(changTextSearch(e.target.value));

        // setText(e.target.value);
    };

    const onSearch = () => {
        const star = gallery === 'bookmark';
        const galleryId = gallery && gallery !== 'bookmark' ? gallery._id : undefined;
        dispatch(searchImage({ text: text_search, galleryId, star }));
        setLoading(false);
    };

    // const changeTextSearch = debounce(async (text: string) => {
    //     const star = gallery === 'bookmark';
    //     const galleryId =
    //         gallery && gallery !== 'bookmark' ? gallery._id : undefined;
    //     dispatch(searchImage({ text, galleryId, star }));
    //     setLoading(false);
    // }, 1000);

    return (
        <Input.Search
            value={text_search}
            placeholder='Tìm kiếm'
            onChange={onChangeSearchText}
            loading={loading}
            onSearch={onSearch}
        />
    );
};

export default SearchImage;
