import { Button, Space, Tabs, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ReloadOutlined } from '@ant-design/icons';
import livestreamApi from '../../../api/livestream-api';
import { ChartIcon, SearchDocumentIcon } from '../../../assets/icon';
import { ILivestreamScript, EScriptStatus } from '../../../collections/livestream-script';
import { Loading } from '../../../components';
import HeaderRight from '../../../components/header-customer/header-right';
import { BaseLayout } from '../../../layout';
import { useNotification } from '../../customer/notfication-context';
import './index.less';
import ScriptDetail from './script-detail';
import ScriptReport from './script-report';

const { TabPane } = Tabs;

interface Props {}

interface Params {
    scriptId?: string;
    fbPageId?: string;
}

const Script = (props: Props) => {
    const store = useSelector((state: any) => state.store.store);
    const { title } = useNotification();

    const [loading, setLoading] = useState(true);
    const [script, setScript] = useState<ILivestreamScript>();
    const params = useParams<Params>();

    const loadScript = async ({ scriptId, fbPageId }: { scriptId: string; fbPageId: string }) => {
        try {
            const response = await livestreamApi.loadScript({
                storeId: store._id,
                fbPageId,
                scriptId,
            });
            setScript(response);
        } catch (error) {
            message.error('Đã có lỗi xảy ra!');
        } finally {
            setLoading(false);
        }
    };

    const loadDataReport = () => {
        setLoading(true);
        if (params.scriptId && params.fbPageId) {
            loadScript({
                scriptId: params.scriptId,
                fbPageId: params.fbPageId,
            });
        } else {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDataReport();
    }, [params.scriptId]);

    if (loading) {
        return <Loading />;
    }

    if (!params.scriptId || !params.fbPageId || !script) {
        return <div>No Script</div>;
    }

    const tabExtraContent = script && script.status === EScriptStatus.InUse && (
        <Button
            icon={<ReloadOutlined />}
            type='primary'
            style={{ backgroundColor: '#307dd2', borderColor: '#307dd2' }}
            onClick={loadDataReport}
        >
            Tải lại trang
        </Button>
    );

    const title_page = `${title} ${script.name}`;

    return (
        <BaseLayout title={title_page}>
            <HeaderRight title={script.name} />

            <div className='content script-detail-content' style={{ padding: 0 }}>
                <Tabs
                    defaultActiveKey='1'
                    onChange={() => {}}
                    tabBarStyle={{
                        paddingLeft: 20,
                        paddingRight: 20,
                        background: '#f6f8f8',
                        borderBottom: '1px solid #d3d9db',
                    }}
                    tabBarExtraContent={tabExtraContent}
                >
                    {script.status !== 0 && (
                        <TabPane
                            tab={
                                <Space size={5}>
                                    <ChartIcon style={{ fontSize: 24, margin: 0 }} />
                                    Thống kê bài livestream
                                </Space>
                            }
                            key='1'
                        >
                            <div className='container'>
                                <ScriptReport script={script} />
                            </div>
                        </TabPane>
                    )}

                    <TabPane
                        tab={
                            <Space size={5}>
                                <SearchDocumentIcon style={{ fontSize: 20, margin: 0 }} />
                                Chi tiết kịch bản
                            </Space>
                        }
                        key='2'
                    >
                        <div className='container'>
                            <ScriptDetail script={script} />
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        </BaseLayout>
    );
};

export default Script;
