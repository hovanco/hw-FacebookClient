import moment from 'moment';
import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CloseIcon } from '../../../assets/icon';
import { TagFilter } from '../../../components';
import { changeFilter, loadLivestreams } from '../../../reducers/livestreamState/livestreamAction';
import { dataActiveScript, dataStatusScript } from './data';
import './filter-detail.less';

interface Props {}

const momentFormat = 'DD/MM/YYYY';

const ScriptFilterDetail = (props: Props) => {
    const dispatch = useDispatch();
    const startTime: number | undefined = useSelector((state: any) => state.livestream.startTime);
    const endTime: number | undefined = useSelector((state: any) => state.livestream.endTime);
    const status: number | undefined = useSelector((state: any) => state.livestream.status);
    const active: boolean | undefined = useSelector((state: any) => state.livestream.active);

    const getActiveScriptTitle = (value: boolean) => {
        let listValueDataActiveScript: Array<any> = Object.values(dataActiveScript);
        return listValueDataActiveScript.filter((item: any) => item.id == value)?.[0]?.title || '';
    };

    const getStatusScriptTitle = (value: number) => {
        return dataStatusScript?.[value]?.title || '';
    };

    const onClearTag = async (filterData: any) => {
        await dispatch(changeFilter(filterData));
        dispatch(loadLivestreams());
    };

    return (
        <div className='advance-script-filter-detail'>
            {status != undefined && (
                <TagFilter
                    closable
                    onClose={() => onClearTag({ status: undefined })}
                    closeIcon={<CloseIcon />}
                >
                    Trạng thái sử dụng: {getStatusScriptTitle(status)}
                </TagFilter>
            )}

            {active != undefined && (
                <TagFilter
                    closable
                    onClose={() => onClearTag({ active: undefined })}
                    closeIcon={<CloseIcon />}
                >
                    Trạng thái kịch bản: {getActiveScriptTitle(active)}
                </TagFilter>
            )}

            {(startTime != undefined || endTime != undefined) && (
                <TagFilter
                    closable
                    onClose={() => onClearTag({ startTime: undefined, endTime: undefined })}
                    closeIcon={<CloseIcon />}
                >
                    Khoảng thời gian: Từ {moment(startTime).format(momentFormat)} đến{' '}
                    {moment(endTime).format(momentFormat)}
                </TagFilter>
            )}
        </div>
    );
};

export default memo(ScriptFilterDetail);
