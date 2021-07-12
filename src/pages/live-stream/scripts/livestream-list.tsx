import { Card, Col, Row } from 'antd';
import React from 'react';
import ScriptFilterDetail from './filter-detail';
import FilterScript from './filter-script/index';
import './livestream-list.less';
import ScriptTable from './script-table';
import ScriptTablePagination from './script-table-pagination';
import SearchScript from './search-script';
import SelectPage from './select-page';

interface Props {}

const LivestreamList = (props: Props) => {
    return (
        <div className='livestream-list-section'>
            <Card>
                <Row gutter={0} className='livestream-table-filter'>
                    <Col>
                        <SelectPage />
                    </Col>

                    <Col style={{ flex: 1, marginLeft: 50 }}>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <FilterScript />
                            <SearchScript />
                        </div>
                    </Col>
                </Row>

                <Row gutter={0} className='livestream-table-filter-detail'>
                    <ScriptFilterDetail />
                </Row>

                <ScriptTable />
            </Card>

            <ScriptTablePagination />
        </div>
    );
};

export default LivestreamList;
