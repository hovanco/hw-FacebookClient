import { Button, message } from 'antd';
import { omit } from 'lodash';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import livestreamApi from '../../../api/livestream-api';
import { loadLivestreams } from '../../../reducers/livestreamState/livestreamAction';

interface Props {
    scripts: any[];
    callback: () => void;
}

const DisableScriptBtn = (props: Props) => {
    const dispatch = useDispatch();
    const store = useSelector((state: any) => state.store.store);
    const [loading, setLoading] = useState(false);

    const disableScript = async () => {
        setLoading(true);
        Promise.all(
            props.scripts.map(async (script: any) => {
                const res = await livestreamApi.updateScript({
                    storeId: store._id,
                    fbPageId: script.fbPageId,
                    scriptId: script._id,

                    data: {
                        ...omit(script, ['_id']),
                        active: false,
                    },
                });

                return res;
            })
        )
            .then((response) => {
                message.success(`Đã ngưng kích hoạt ${props.scripts.length} kịch bản`);
                setLoading(false);
                props.callback();
                dispatch(loadLivestreams());
            })
            .catch((error) => {
                message.error('Lỗi ngưng kích hoạt kịch bản');
                setLoading(false);
            });
    };

    return (
        <Button loading={loading} onClick={disableScript}>
            Ngưng kích hoạt
        </Button>
    );
};

export default DisableScriptBtn;
