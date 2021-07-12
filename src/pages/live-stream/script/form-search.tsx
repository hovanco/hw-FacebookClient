import { Form, Input } from 'antd';
import { Store } from 'antd/lib/form/interface';
import React, { FC } from 'react';
import { SearchIcon } from '../../../assets/icon';

interface Props {
    handleSearch: (text: string) => void;
}

const FormSearch: FC<Props> = ({ handleSearch }) => {
    const onFinish = (values: Store) => {
        handleSearch(values.text);
    };
    return (
        <Form onFinish={onFinish}>
            <Form.Item name='text'>
                <Input prefix={<SearchIcon />} allowClear placeholder='Nhập từ khóa tìm kiếm' />
            </Form.Item>
        </Form>
    );
};

export default FormSearch;
