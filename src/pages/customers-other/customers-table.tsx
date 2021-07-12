import { FilterOutlined } from '@ant-design/icons';
import { Button, Col, Row, Table } from 'antd';
import React, { Fragment } from 'react';

import SelectDate from '../report/form-filter/select-date';
import SelectDateType from '../report/form-filter/select-date-type';
import SelectPage from '../report/form-filter/select-page';
import columns from './columns';
import { useContextCustomer } from './context';

function CustomersTable(): JSX.Element {
    const {
        pageId,
        selectPage,
        setPageCustomer,
        handleFilter,
        selectDate,
        selectDateType,
        customers,
        total,
        date,
        type,
        loading,
        pageCustomer,
    } = useContextCustomer();

    const onChangePage = (page: number, pageSize?: number | undefined) => {
        setPageCustomer(page);
        handleFilter(page);
    };

    return (
        <Fragment>
            <Row gutter={15} style={{ padding: '0 30px 20px 0' }}>
                <Col span={3}>
                    <SelectPage selectPage={selectPage} valuePage={pageId} />
                </Col>
                <Col span={3}>
                    <SelectDateType selectDateType={selectDateType} type={type} />
                </Col>
                <Col span={5}>
                    <SelectDate selectDate={selectDate} type={type} date={date} />
                </Col>
                <Col span={1}>
                    <Button loading={loading} type='primary' onClick={() => handleFilter(1)}>
                        <FilterOutlined /> Lọc
                    </Button>
                </Col>
            </Row>
            <Table
                loading={loading}
                rowKey='_id'
                columns={columns([])}
                dataSource={customers}
                pagination={{
                    onChange: onChangePage,
                    current: pageCustomer,
                    total,
                    pageSize: 10,
                }}
                bordered
            />
        </Fragment>
    );
}

export default CustomersTable;
