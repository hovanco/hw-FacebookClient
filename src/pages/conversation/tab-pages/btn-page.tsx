import { UserOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Avatar, Badge, Tooltip } from 'antd';
import React, { FC, memo, ReactElement } from 'react';
import { Page } from '../../../reducers/fanpageState/fanpageReducer';
import { generateUrlImgFb } from '../../../utils/generate-url-img-fb';

import './btn-page.less';

interface Props {
    active?: boolean;
    page: Page;
    onClick: (page: any) => void;
    hidePage: (page: any) => void;
}

const BtnPage: FC<Props> = ({ page, active, onClick, hidePage }): ReactElement => {
    const className = active ? 'btn-page active' : 'btn-page';

    return (
        <div className={className} >
            <div
                style={{ display: 'flex', alignItems: 'center' }}
                onClick={() => onClick(page)}
            >
                <Avatar
                    src={generateUrlImgFb(page.fbObjectId, page.accessToken)}
                    icon={<UserOutlined />}
                    size='small'
                    style={{ marginRight: 10 }}
                />
                <span className='text'>{page.name}</span>
                <Badge className='badge' count={page.countUnread} />
            </div>
            <Tooltip
                placement='right'
                title='Ẩn trang'
                overlayClassName='hide-tooltip'
                mouseEnterDelay={0.4}
            >
                <CloseCircleOutlined
                    onClick={() => hidePage(page)}
                    className='hide-icon'
                />
            </Tooltip>
        </div>
    );
};

BtnPage.defaultProps = {
    active: false,
};

export default memo(BtnPage);
