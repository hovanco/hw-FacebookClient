import { SettingOutlined } from '@ant-design/icons';
import { Button, Popover, Space } from 'antd';
import { push } from 'connected-react-router';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { TagIcon } from '../../../assets/icon';
import { ILabel } from '../../../collections/label';
import { setDefaultActiveKey } from '../../../reducers/setting/settingAction';
import Label from './label';

interface Props {
    labels: ILabel[];
}

const LabelMore: FC<Props> = ({ labels }): JSX.Element => {
    const dispatch = useDispatch();
    const handleSetting = () => {
        dispatch(setDefaultActiveKey('conversation_label'));
        dispatch(push('/customer/other/setting'));
    };
    return (
        <Popover
            overlayStyle={{ width: 175 }}
            content={
                <Space
                    direction='vertical'
                    size={5}
                    style={{ margin: '-5px -10px', width: 'calc(100% + 20px)' }}
                >
                    <Button
                        icon={<SettingOutlined />}
                        onClick={handleSetting}
                        block
                        style={{ textAlign: 'left', paddingLeft: 10 }}
                    >
                        Cài đặt
                    </Button>
                    {labels.map((label) => (
                        <Label label={label} block key={label._id} />
                    ))}
                </Space>
            }
            title={null}
            trigger='hover'
        >
            <div className='item'>
                <TagIcon />
            </div>
        </Popover>
    );
};

export default LabelMore;
