import { Button, message } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import livestreamApi from '../../../api/livestream-api';
import { loadLivestreams } from '../../../reducers/livestreamState/livestreamAction';

interface Props {
    scripts: string[];
    callback: () => void;
}

const RemoveScriptBtn = (props: Props) => {
    const dispatch = useDispatch();
    const store = useSelector((state: any) => state.store.store);
    const [loading, setLoading] = useState(false);

    const removeScripts = async () => {
        setLoading(true);

        Promise.all(
            props.scripts.map(async (script: any) => {
                const res = await livestreamApi.deleteScript({
                    storeId: store._id,
                    fbPageId: script.fbPageId,
                    scriptId: script._id,
                });
                return res;
            })
        )
            .then((response) => {
                message.success(`Đã xóa ${props.scripts.length} thành công`);
                setLoading(false);
                props.callback();
                dispatch(loadLivestreams());
            })
            .catch((error) => {
                message.error('Lỗi xóa kịch bản');
                setLoading(false);
            });
    };

    return (
        <Button type='primary' danger loading={loading} onClick={removeScripts}>
            Xóa kịch bản
        </Button>
    );
};

export default RemoveScriptBtn;
