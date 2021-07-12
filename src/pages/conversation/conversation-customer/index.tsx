import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ProviderOrderContext } from './context-order';
import CustomerTab from './customer-tab';
import OrderTab from './order-tab';
import Tab from './tab';

import './style.less';

const ConversationCustomer = (): JSX.Element => {
    const conversation = useSelector((state: any) => state.fanpage.conversation);

    const [key, setKey] = useState('1');

    const changeTabs = React.useCallback(
        (e: any) => {
            if (e.code === 'F4') {
                setKey(key === '1' ? '2' : '1');
            }

            return null;
        },
        [key]
    );

    useEffect(() => {
        document.addEventListener('keydown', changeTabs);

        return () => {
            document.removeEventListener('keydown', changeTabs);
        };
    }, [changeTabs]);

    useEffect(() => {
        if (conversation) {
            setKey('1');
        }
    }, [conversation]);

    const callback = (key: string) => {
        setKey(key);
    };

    if (!conversation) {
        return <div />;
    }

    return (
        <ProviderOrderContext>
            <div className='conversation-order'>
                <div className='tabs'>
                    <Tab
                        active={key === '1'}
                        tab={{
                            key: '1',
                            title: 'Khách hàng',
                        }}
                        onClick={(key: string) => setKey(key)}
                    />
                    <Tab
                        active={key === '2'}
                        tab={{
                            key: '2',
                            title: ' Tạo đơn',
                        }}
                        onClick={(key: string) => setKey(key)}
                    />
                </div>

                <div className='tab-content'>
                    {key === '1' && <CustomerTab />}
                    {key === '2' && <OrderTab />}
                </div>
            </div>
        </ProviderOrderContext>
    );
};

export default ConversationCustomer;
