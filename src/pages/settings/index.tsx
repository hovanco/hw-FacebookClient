import { Tabs } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HeaderRight from '../../components/header-customer/header-right';
import { BaseLayout } from '../../layout';
import { setDefaultActiveKey } from '../../reducers/setting/settingAction';
import { useNotification } from '../customer/notfication-context';
import './style.less';
import tabs from './tabs';

interface IProps {}

const { TabPane } = Tabs;
const text = 'Cài đặt';

function Settings(props: IProps): JSX.Element {
    const { title } = useNotification();
    const { defaultActiveKey } = useSelector((state: any) => state.setting);
    const dispatch = useDispatch();
    const title_page = `${title} ${text} `;

    const changeTab = (activeKey: string) => {
        dispatch(setDefaultActiveKey(activeKey));
    };

    return (
        <BaseLayout title={title_page}>
            <div className='setting-wrap main'>
                <HeaderRight title={text} />

                <div className='content'>
                    <Tabs defaultActiveKey={defaultActiveKey} onChange={changeTab}>
                        {tabs.map((tab) => {
                            return (
                                <TabPane
                                    tab={
                                        <span>
                                            {tab.icon}
                                            {tab.title}
                                        </span>
                                    }
                                    key={tab.key}
                                >
                                    <div className='setting-tab-content'>{tab.component}</div>
                                </TabPane>
                            );
                        })}
                    </Tabs>
                </div>
            </div>
        </BaseLayout>
    );
}

export default Settings;
