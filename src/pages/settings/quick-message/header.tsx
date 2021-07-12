import React from 'react';
import { useSelector } from 'react-redux';
import { Button, Input, Select } from 'antd';
import { PlusOutlined, CopyOutlined } from '@ant-design/icons';
import { FanpageStateInterface } from '../../../reducers/setting/interfaces';
import { generateUrlImgFb } from '../../../utils/generate-url-img-fb';

const { Search } = Input;
const { Option } = Select;
interface IProps {
    defaultPage: string;
    toggle: () => void;
    toggleModalCopy: () => void;
    onSearch: (val: string) => void;
    onChangePage: (page: string) => void;
}
interface IState {
    fanpage: FanpageStateInterface;
}

function QuickMessageHeader({
    defaultPage,
    toggle,
    toggleModalCopy,
    onSearch,
    onChangePage,
}: IProps): JSX.Element {
    const { pages } = useSelector(({ fanpage }: IState) => fanpage);
    const renderFanpages = Object.values(pages).map((fanpage: any) => (
        <Option key={fanpage._id} value={fanpage._id}>
            <img src={generateUrlImgFb(fanpage.fbObjectId, fanpage.accessToken)} alt='' />
            {fanpage.name}
        </Option>
    ));

    return (
        <div className='quick-message-header-wrap header-label'>
            <Select
                style={{ width: 150, marginRight: '16px' }}
                defaultValue={defaultPage}
                onSelect={onChangePage}
            >
                {renderFanpages}
            </Select>
            <Button style={{ marginRight: '16px' }} icon={<PlusOutlined />} onClick={toggle}>
                Thêm
            </Button>
            <Button
                style={{ marginRight: '16px' }}
                icon={<CopyOutlined />}
                onClick={toggleModalCopy}
            >
                Copy sang page khác
            </Button>
            <Search
                placeholder='Tìm kiếm tin nhắn...'
                onSearch={onSearch}
                allowClear
                size='large'
            />
        </div>
    );
}

export default QuickMessageHeader;
