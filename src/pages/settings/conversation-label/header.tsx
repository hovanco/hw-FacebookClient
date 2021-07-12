import { Col, Row } from 'antd';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';

import SelectPage from '../../report/form-filter/select-page';
import { useContextLabel } from './context';
import ModalAddLabel from './modal-add-label';
import ModalCopyLabel from './modal-copy-label';

const Header: FC = (): JSX.Element => {
    const pages = useSelector((state: any) => state.fanpage.pages);
    const { selectPage, page } = useContextLabel();

    const defaultPage = Object.keys(pages)[0];

    return (
        <Row gutter={15} className='header-label'>
            <Col>
                <SelectPage selectPage={selectPage} valuePage={page || defaultPage} />
            </Col>

            <Col>
                <ModalAddLabel />
            </Col>

            <Col>
                <ModalCopyLabel />
            </Col>
        </Row>
    );
};

export default Header;
