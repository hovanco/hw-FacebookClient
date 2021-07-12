import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import { useDispatch } from 'react-redux';
import { changeName, loadLivestreams } from '../../../reducers/livestreamState/livestreamAction';

interface Props {}

const SearchScript = (props: Props) => {
    const dispatch = useDispatch();
    const changeScript = (e: any) => {
        const text = e.target.value;
        searchScript(text);
    };
    const searchScript = debounce(async (text: string) => {
        await dispatch(changeName(text));
        dispatch(loadLivestreams());
    }, 700);

    return (
        <Input
            prefix={<SearchOutlined />}
            placeholder='Tìm kiếm kịch bản'
            onChange={changeScript}
            style={{ width: 435, marginLeft: 10 }}
        />
    );
};

export default SearchScript;
