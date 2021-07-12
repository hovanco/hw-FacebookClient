import React, { useState } from 'react';
import { Button } from 'antd';
import { ButtonSize } from 'antd/lib/button';
import { DeleteOutlined } from '@ant-design/icons';

interface IProps {
    membersSelect: any;
    size: ButtonSize;
}

function BtnRemoveMember({ membersSelect, size }: IProps): JSX.Element {
    const [loading, setLoading] = useState(false);

    const removeMembers = () => {
        setLoading(true);
    };

    const disabled = membersSelect.length === 1;

    return (
        <Button
            type='primary'
            danger
            size={size}
            disabled={disabled || loading}
            loading={loading}
            onClick={removeMembers}
        >
            <DeleteOutlined />
            Xóa thành viên
        </Button>
    );
}

export default BtnRemoveMember;
