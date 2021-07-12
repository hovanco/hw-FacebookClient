import { CloseOutlined, SaveFilled } from '@ant-design/icons';
import { Button, Input, InputNumber, message } from 'antd';
import { pick } from 'lodash';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';

import * as settingApi from '../../../api/setting';
import { ILabel } from '../../../collections/label';
import { updateOrderLabel } from '../../../reducers/labelState/labelAction';

interface Props {
    label: ILabel;
    storeId: string;
    pageId: string;
}

const EditOrderLabel: FC<Props> = ({ label, storeId, pageId }) => {
    const [order, setOrder] = useState(label.order);
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const dispatch = useDispatch();

    const onChange = (e: any) => {
        if (!isEdit) {
            setIsEdit(true);
        }

        setOrder(e);
    };

    const onCancel = () => {
        setIsEdit(false);
        setOrder(label.order);
    };

    const onSave = () => {
        setLoading(true);

        const data = {
            ...pick(label, ['name', 'color', 'backgroundColor', 'status']),
            order,
        };

        settingApi
            .updateLabel({
                storeId,
                pageId,
                data,
                labelId: label._id,
            })
            .then(() => {
                message.success('Đã chỉnh sửa sắp xếp');
                setIsEdit(false);
                dispatch(updateOrderLabel(label._id, order));
            })
            .catch(() => {
                message.error('Lỗi chỉnh sửa sắp xếp');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Input.Group compact>
            <InputNumber onChange={onChange} value={order} min={0} />
            {isEdit && (
                <>
                    <Button icon={<SaveFilled />} type='primary' onClick={onSave} loading={loading}>
                        Lưu
                    </Button>
                    <Button icon={<CloseOutlined />} onClick={onCancel}></Button>
                </>
            )}
        </Input.Group>
    );
};

export default EditOrderLabel;
