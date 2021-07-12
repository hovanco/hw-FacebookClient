import React, { FC, ReactElement, useState } from 'react';
import { Modal, Divider, Input, Button, message } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

import useModal from '../../../hooks/use-modal';
import FilterBarItem from './filter-bar-item';
import { EmultipleIcon } from '../../../assets/icon';
import guide from '../../../assets/guide-getlinkpost.png';

interface Props {
    selected: string[];
    onClick: (value: string, action: string, active: string) => void;
}

const FilterIdPost: FC<Props> = ({ selected, onClick }): ReactElement => {
    const [url, setUrl] = useState('');
    const { visible, toggle } = useModal();

    const handleClick = (isFiltered: boolean) => {
        const queryString = url && url.split('?') ? url.split('?')[1] : '';
        const urlParams = new URLSearchParams(queryString);
        const postId = `${urlParams.get('id')}_${urlParams.get('story_fbid')}`;
        if (!queryString || !urlParams.get('id') || !urlParams.get('story_fbid')) {
            message.error('Link bài viết không hợp lệ');
            return;
        }
        if (isFiltered) {
            onClick(postId, 'add', 'post_id');
        } else {
            setUrl('');
            onClick(postId, 'delete', 'post_id');
        }
        toggle();
    };

    const onChange = (e: { target: { value: React.SetStateAction<string> } }) => {
        setUrl(e.target.value);
    };

    const handleReset = () => {
        toggle();
        setUrl('');
    };

    return (
        <>
            <FilterBarItem
                onClick={toggle}
                menu={{
                    icon: <EmultipleIcon />,
                    title: 'Tìm theo ID bài viết',
                    active: 'post_id',
                }}
                selected={selected}
            />
            <Modal
                width={450}
                onCancel={toggle}
                onOk={toggle}
                visible={visible}
                title='Tìm theo id bài viết'
                footer={null}
            >
                <div>Hướng dẫn lấy link</div> <br />
                <img
                    style={{ display: 'block', width: '100%' }}
                    src={guide}
                    alt=''
                />
                <br />
                <div>Nhập link bài viết:</div> <br />
                <div>
                    <Input autoFocus={visible} onChange={onChange} value={url} />
                </div>
                <Divider />
                <div style={{ textAlign: 'right' }}>
                    <Button
                        type='primary'
                        danger
                        style={{ marginRight: 10 }}
                        onClick={handleReset}
                    >
                        Hủy
                    </Button>
                    <Button type='primary' onClick={() => handleClick(true)}>
                        Lọc
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default FilterIdPost;
