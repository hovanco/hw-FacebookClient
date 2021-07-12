import { Avatar, Select } from 'antd';
import { find, map } from 'lodash';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DownIcon } from '../../../assets/icon';
import {
    loadLivestreams,
    selectPage,
    updateCurrentPageOfPagination,
} from '../../../reducers/livestreamState/livestreamAction';
import { generateUrlImgFb } from '../../../utils/generate-url-img-fb';

interface Props {}

const SelectPage = (props: Props) => {
    const dispatch = useDispatch();
    const pages = useSelector((state: any) => state.fanpage.pages);
    const page_select = useSelector((state: any) => state.livestream.fbPageId);

    const changePage = async (page: string) => {
        await dispatch(updateCurrentPageOfPagination(1));
        await dispatch(selectPage(page));
        dispatch(loadLivestreams());
    };

    const value = () => {
        const page = page_select && find(pages, (page: any) => page.fbObjectId === page_select);

        if (page) {
            return page.fbObjectId;
        }

        if (Object.keys(pages).length === 0) {
            return undefined;
        }

        return pages[Object.keys(pages)[0]].fbObjectId;
    };

    return (
        <Select
            suffixIcon={<DownIcon />}
            style={{ width: 190 }}
            placeholder='Chọn page'
            value={value()}
            onChange={changePage}
        >
            {map(pages, (page: any) => {
                return (
                    <Select.Option key={page.fbObjectId} value={page.fbObjectId}>
                        <Avatar
                            size='small'
                            src={generateUrlImgFb(page.fbObjectId, page.accessToken)}
                            style={{ marginRight: 3 }}
                        />
                        {page.name}
                    </Select.Option>
                );
            })}
        </Select>
    );
};

export default SelectPage;
