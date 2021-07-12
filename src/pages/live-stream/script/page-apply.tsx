import React from 'react';
import { useSelector } from 'react-redux';
import { Avatar, Spin, Space } from 'antd';
import { find } from 'lodash';
import { generateUrlImgFb } from '../../../utils/generate-url-img-fb';

interface Props {
    fbPageId: string;
}

const PageApply = (props: Props) => {
    const loading = useSelector((state: any) => state.fanpage.loading);
    const pages = useSelector((state: any) => state.fanpage.pages);

    if (loading) return <Spin />;

    const page = find(pages, (page: any) => page.fbObjectId === props.fbPageId);

    if (!page) return <span>--</span>;

    return (
        <a target='_blank' href={page.link}>
            <Space>
                <Avatar src={generateUrlImgFb(page.fbObjectId, page.accessToken)} />
                <span>{page.name}</span>
            </Space>
        </a>
    );
};

export default PageApply;
