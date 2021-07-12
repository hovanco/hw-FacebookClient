import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { message, Switch } from 'antd';
import { pick } from 'lodash';
import React, { FC, useState } from 'react';

import * as settingApi from '../../../api/setting';
import { ILabel } from '../../../collections/label';

interface Props {
    label: ILabel;
    storeId: string;
    pageId: string;
}

const EditLabelStatus: FC<Props> = ({ label, storeId, pageId }) => {
    const [status, setStatus] = useState(label.status);
    const [loading, setLoading] = useState(false);

    const onChange = (value: boolean) => {
        const new_status = !value ? 0 : 1;
        setStatus(new_status);

        setLoading(true);

        const data = {
            ...pick(label, ['name', 'color', 'backgroundColor', 'order']),
            status: new_status,
        };

        settingApi
            .updateLabel({
                storeId,
                pageId,
                data,
                labelId: label._id,
            })
            .then(() => {
                setLoading(false);
                message.success('Đã đổi trạng thái');
            })
            .catch(() => {
                setLoading(false);
                message.error('Lỗi đổi trạng thái');
            });
    };

    return (
        <Switch
            className={'switch-status'}
            loading={loading}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            onChange={onChange}
            checked={status === 1}
        />
    );
};

export default EditLabelStatus;
