import { message, Modal, Switch, Tooltip } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import livestreamApi from '../../../api/livestream-api';
import { updateScript, loadLivestreams } from '../../../reducers/livestreamState/livestreamAction';
import { checkActiveAndNotUseScripts } from '../shared';
import { EScriptType, EScriptStatus } from '../../../collections/livestream-script';

interface Props {
    script: any;
}

const SwitchActiveScript = ({ script }: Props) => {
    const dispatch = useDispatch();
    const store = useSelector((state: any) => state.store.store);
    const [loading, setLoading] = useState(false);

    const disabledSwitch = !script.active && script.status !== 0;

    const handleOnChange = async () => {
        if (script.type === EScriptType.EndedLivestream && !script.videoId) {
            return message.error('Kịch bản chưa chọn video, hãy bổ sung trước khi kích hoạt');
        }

        setLoading(true);

        if (
            script.active &&
            [EScriptStatus.InUse, EScriptStatus.CreatingOrder].includes(script.status)
        ) {
            Modal.confirm({
                width: 450,
                title: 'Bạn có chắc chắn muốn ngừng kịch bản này?',
                content: 'Kịch bản đang hoạt động sẽ không hoạt động trở lại.',
                onCancel: () => {
                    setLoading(false);
                },
                onOk: () => {
                    changeActiveScript();
                },
            });
        } else if (!script.active) {
            await checkActiveAndNotUseScripts({
                fbPageId: script.fbPageId,
                storeId: store._id,
                onOk: async () => {
                    await changeActiveScript();
                    dispatch(loadLivestreams());
                },
                onCancel: () => setLoading(false),
            });
        } else {
            changeActiveScript();
        }
    };

    const changeActiveScript = async () => {
        await livestreamApi
            .changeActiveScript({
                storeId: store._id,
                fbPageId: script.fbPageId,
                scriptId: script._id,
                active: !script.active,
            })
            .then(() => {
                setLoading(false);
                dispatch(updateScript({ ...script, active: !script.active }));
                message.success(
                    `Đã ${script.active ? 'ngưng kích hoạt' : 'kích hoạt'} ${
                        script.name
                    } thành công`,
                );
            })
            .catch(() => {
                setLoading(false);
                message.error(`Lỗi thay đổi trạng thái kịch bản`);
            });
    };

    return (
        <Tooltip
            title={
                disabledSwitch
                    ? 'Không thể thao tác với kịch bản đang tạo đơn hàng hoặc đã kết thúc'
                    : ''
            }
        >
            <Switch
                size='default'
                checked={script.active}
                onChange={handleOnChange}
                loading={loading}
                disabled={disabledSwitch}
            />
        </Tooltip>
    );
};

export default SwitchActiveScript;
