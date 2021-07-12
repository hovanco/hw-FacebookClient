import React, { FC } from 'react';
import { Select, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { map } from 'lodash';
import { Page } from '../../../reducers/fanpageState/fanpageReducer';
import { generateUrlImgFb } from '../../../utils/generate-url-img-fb';

const { Option } = Select;

interface Props {
    selectPage?: any;
    valuePage?: any;
}

const SelectPage: FC<Props> = ({ selectPage, valuePage }): JSX.Element => {
    const pages = useSelector((state: any) => state.fanpage.pages);

    const onChangePage = (pageId: string) => {
        selectPage(pageId);
    };

    const renderPages = map(pages, (page: Page) => (
        <Option className='option-label' key={page._id} value={page._id}>
            <Avatar
                src={generateUrlImgFb(page.fbObjectId, page.accessToken)}
                icon={<UserOutlined />}
                size='small'
                style={{ marginRight: 10 }}
            />
            {page.name}
        </Option>
    ));

    return (
        <Select
            style={{ width: '100%' }}
            placeholder='Chọn page'
            onChange={onChangePage}
            value={valuePage}
        >
            {renderPages}
        </Select>
    );
};

export default SelectPage;
