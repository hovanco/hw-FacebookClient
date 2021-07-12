import React, { FC } from 'react';
import { ProviderLabelContext } from './context';
import Header from './header';
import LabelTable from './label-table';

import './style.less';

const ConversationLabel: FC = () => {
    return (
        <ProviderLabelContext>
            <Header />
            <div style={{ marginTop: 20 }}>
                <LabelTable />
            </div>
        </ProviderLabelContext>
    );
};

export default ConversationLabel;
