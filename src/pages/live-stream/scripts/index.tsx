import { Button, Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import livestreamApi from '../../../api/livestream-api';
import { Loading } from '../../../components';
import HeaderRight from '../../../components/header-customer/header-right';
import { BaseLayout } from '../../../layout';
import { loadLivestreams } from '../../../reducers/livestreamState/livestreamAction';
import EmptyLivestream from './empty-livestream';
import LivestreamList from './livestream-list';
import { PlusThickerIcon } from '../../../assets/icon';
import useHiddenModalExpired from '../../../hooks/use-hidden-modal-expired';

interface Props {}

const title_page = '';

const useCheckEmptyLiveStream = () => {
    const store = useSelector((state: any) => state.store.store);
    const [loading, setLoading] = useState<boolean>(true);
    const [isEmpty, setIsEmpty] = useState<boolean>(false);

    useEffect(() => {
        async function handleCheckEmptyLivestream(storeId: string) {
            try {
                setLoading(true);
                const response = await livestreamApi.checkEmptyLivestream(storeId);
                setIsEmpty(response.isEmpty);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }

        if (store) {
            handleCheckEmptyLivestream(store._id);
        }
    }, [store]);

    return {
        isEmpty,
        loadingEmptyLivestream: loading,
    };
};

const LiveStreamList = (props: Props) => {
    const dispatch = useDispatch();

    const loading = useSelector((state: any) => state.livestream.loading);
    const isLoaded = useSelector((state: any) => state.livestream.isLoaded);
    const loadingPage = useSelector((state: any) => state.fanpage.loading);

    const { isEmpty, loadingEmptyLivestream } = useCheckEmptyLiveStream();
    const { hiddenModalExpired } = useHiddenModalExpired();

    useEffect(() => {
        if (!loadingEmptyLivestream && !isEmpty) {
            dispatch(loadLivestreams());
        }
    }, [isEmpty, loadingEmptyLivestream]);

    const renderContent = () => {
        if (isEmpty) return <EmptyLivestream />;

        if (loadingEmptyLivestream || ((loadingPage || loading) && !isLoaded)) return <Loading />;

        return <LivestreamList />;
    };

    return (
        <BaseLayout title={title_page}>
            <HeaderRight title='Danh sách kịch bản livestream' />
            <div className='heading' style={{ backgroundColor: '#f6f8f8' }}>
                <Row align='middle' justify='end'>
                    <Col>
                        <Link to='/customer/livestream/new'>
                            <Button
                                disabled={hiddenModalExpired}
                                icon={<PlusThickerIcon />}
                                type='primary'
                                className='btn-add'
                            >
                                Thêm mới
                            </Button>
                        </Link>
                    </Col>
                </Row>
            </div>
            <div className='content' style={{ backgroundColor: '#edf1f2' }}>
                {renderContent()}
            </div>
        </BaseLayout>
    );
};

export default LiveStreamList;
