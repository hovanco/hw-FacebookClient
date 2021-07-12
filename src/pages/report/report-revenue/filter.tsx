import React, { FC } from 'react';
import { Row, Col, Button } from 'antd';

import SelectPage from '../form-filter/select-page';
import SelectDateType from '../form-filter/select-date-type';
import SelectDate from '../form-filter/select-date';
import { useReportRevenueContext } from './context';
import ButtonFilter from '../form-filter/button-filter';

const Filter: FC = (): JSX.Element => {
    const {
        type,
        date,
        loading,
        handleFilter,
        pageId,
        selectDateType,
        selectDate,
        selectPage,
    } = useReportRevenueContext();

    const onFilter = () => {
        handleFilter();
    };

    return (
        <Row gutter={10}>
            <Col>
                <SelectPage selectPage={selectPage} />
            </Col>
            <Col>
                <SelectDateType selectDateType={selectDateType} type={type} />
            </Col>
            <Col>
                <SelectDate date={date} selectDate={selectDate} type={type} />
            </Col>

            <Col>
                <ButtonFilter
                    loading={loading}
                    values={{
                        date,
                        type,
                        pageId,
                    }}
                    onClick={onFilter}
                />
            </Col>
        </Row>
    );
};

export default Filter;
