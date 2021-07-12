import livestreamApi from '../../api/livestream-api';
import { Modal } from 'antd';

export const checkActiveAndNotUseScripts = async ({
    fbPageId,
    storeId,
    onOk,
    onCancel,
}: {
    fbPageId: string;
    storeId: string;
    onOk?: Function;
    onCancel?: Function;
}) => {
    const hasActiveAndNotUseScripts = await livestreamApi.checkActiveAndNotUseScripts({
        storeId,
        fbPageId,
    });

    if (hasActiveAndNotUseScripts) {
        Modal.confirm({
            content:
                'Kích hoạt kịch bản này sẽ tạm thời ngừng kích hoạt những kịch bản cùng loại chưa sử dụng',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            async onOk() {
                onOk && onOk();
            },
            onCancel() {
                onCancel && onCancel();
            },
        });
    } else {
        onOk && onOk();
    }
};
