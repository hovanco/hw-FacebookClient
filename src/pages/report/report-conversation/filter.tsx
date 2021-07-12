import { Col, Row } from 'antd';
import React, { FC } from 'react';

import ButtonFilter from '../form-filter/button-filter';
import SelectDate from '../form-filter/select-date';
import SelectDateType from '../form-filter/select-date-type';
import SelectPage from '../form-filter/select-page';
import { useReportConversationContext } from './context';

const Filter: FC = (): JSX.Element => {
    const {
        type,
        pageId,
        date,
        handleFilter,
        selectPage,
        selectDateType,
        selectDate,
        loading,
    } = useReportConversationContext();

    return (
        <Row gutter={10} style={{ marginBottom: 15 }}>
            <Col span={4}>
                <SelectPage selectPage={selectPage} />
            </Col>
            <Col span={3}>
                <SelectDateType selectDateType={selectDateType} type={type} />
            </Col>
            <Col span={type !== 'custom' ? 4 : 8}>
                <SelectDate date={date} selectDate={selectDate} type={type} />
            </Col>
            <Col span={2}>
                <ButtonFilter
                    onClick={handleFilter}
                    values={{
                        date,
                        type,
                        pageId,
                    }}
                    loading={loading}
                />
            </Col>
        </Row>
    );
};

export default Filter;
