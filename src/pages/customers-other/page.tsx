import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Tag } from 'antd';

interface Props {
    pageId: string;
}

const Page: FC<Props> = ({ pageId }) => {
    const pages = useSelector((state: any) => state.fanpage.pages);

    if (!pageId || Object.keys(pages).length === 0) return null;

    const page = pages[pageId];

    if (!page) return null;

    return <Tag>{page.name}</Tag>;
};

export default Page;
