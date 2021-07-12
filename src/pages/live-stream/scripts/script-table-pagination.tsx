import { Pagination } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { changeFilter, loadLivestreams } from '../../../reducers/livestreamState/livestreamAction';
import React from 'react';

interface Props {}

const ScriptTablePagination = (props: Props) => {
    const dispatch = useDispatch();
    const total = useSelector((state: any) => state.livestream.total);
    const limit = useSelector((state: any) => state.livestream.limit);
    const page = useSelector((state: any) => state.livestream.page);

    const onPaginationChange = async (page: number, pageSize?: number | undefined) => {
        await dispatch(
            changeFilter({
                page,
                limit: pageSize,
            })
        );
        dispatch(loadLivestreams());
    };

    return (
        <div className='script-table-pagination'>
            <Pagination
                current={page}
                total={total}
                pageSize={limit}
                onChange={onPaginationChange}
            />
        </div>
    );
};

export default ScriptTablePagination;
