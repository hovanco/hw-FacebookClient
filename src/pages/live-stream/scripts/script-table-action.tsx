import React, { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CaretDownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, message, Modal } from 'antd';
import { IScript } from './interface';
import livestreamApi from '../../../api/livestream-api';
import {
    loadLivestreams,
    loadLiveStreamStart,
    loadLiveStreamFailed,
} from '../../../reducers/livestreamState/livestreamAction';

interface Props {
    scripts: Array<IScript>;
    resetScriptSelect: Function;
}

const ScriptTableAction: FC<Props> = ({ scripts, resetScriptSelect }): JSX.Element => {
    const dispatch = useDispatch();
    const store = useSelector((state: any) => state.store.store);
    const [loading, setLoading] = useState(false);

    const disableScript = async () => {
        setLoading(true);

        Modal.confirm({
            title: 'Ngưng kích hoạt kịch bản',
            icon: <ExclamationCircleOutlined />,
            content: <span>Bạn chắc chắn muốn ngưng kích hoạt kịch bản đã chọn</span>,
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
                dispatch(loadLiveStreamStart());

                Promise.all(
                    scripts.map(async (script: any) => {
                        const res = await livestreamApi.changeActiveScript({
                            storeId: store._id,
                            fbPageId: script.fbPageId,
                            scriptId: script._id,
                            active: false,
                        });

                        return res;
                    })
                )
                    .then((response) => {
                        message.success(`Đã ngưng kích hoạt ${scripts.length} kịch bản`);
                        setLoading(false);
                        dispatch(loadLivestreams());
                    })
                    .catch((error) => {
                        message.error('Lỗi ngưng kích hoạt kịch bản');
                        setLoading(false);

                        dispatch(loadLiveStreamFailed());
                    });
            },
            onCancel() {
                setLoading(false);
            },
        });
    };

    const removeScripts = async () => {
        setLoading(true);

        Modal.confirm({
            title: 'Xóa kịch bản',
            icon: <ExclamationCircleOutlined />,
            content: <span>Bạn chắc chắn muốn xóa kịch bản đã chọn</span>,
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
                Promise.all(
                    scripts.map(async (script: any) => {
                        const res = await livestreamApi.deleteScript({
                            storeId: store._id,
                            fbPageId: script.fbPageId,
                            scriptId: script._id,
                        });
                        return res;
                    })
                )
                    .then((response) => {
                        message.success(`Đã xóa ${scripts.length} thành công`);
                        setLoading(false);
                        dispatch(loadLivestreams());
                        resetScriptSelect();
                    })
                    .catch((error) => {
                        message.error('Lỗi xóa kịch bản');
                        setLoading(false);
                    });
            },
            onCancel() {
                setLoading(false);
            },
        });
    };

    const menu = (
        <Menu>
            <Menu.Item key='0' onClick={disableScript}>
                Ngưng kích hoạt
            </Menu.Item>
            <Menu.Item key='1' onClick={removeScripts}>
                Xóa kịch bản
            </Menu.Item>
        </Menu>
    );
    return (
        <Dropdown overlay={menu} trigger={['click']} disabled={loading}>
            <Button>
                Chọn thao tác <CaretDownOutlined />
            </Button>
        </Dropdown>
    );
};

export default ScriptTableAction;
