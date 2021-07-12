import React, { FC, ReactElement, useState } from 'react';
import { Popover, DatePicker, Button } from 'antd';
import moment from 'moment';
import { TableOutlined } from '@ant-design/icons';

import SidebarItem from './sidebar-item';
const { RangePicker } = DatePicker;

interface Props {
    selected: string[];
    onClick: (value: string, action: string, active: string) => void;
}

const FilterDate: FC<Props> = ({ selected, onClick }): ReactElement => {
    const dateFormat = 'DD/MM/YYYY';
    const [visible, setVisible] = useState(false);
    const [startDate, setStartDate] = useState(moment());
    const [endDate, setEndDate] = useState(moment());
    const [block, setBlock] = useState(false);

    const toggle = () => {
        setVisible(!visible);
    };

    const handleClick = (isFiltered: boolean) => {
        const value = `${startDate.startOf('day').valueOf()}-${endDate.endOf('day').valueOf()}`;
        if (isFiltered) {
            onClick(value, 'add', 'date');
        } else {
            onClick(value, 'delete', 'date');
        }
        toggle();
    };

    const onChange = (value: any, dateString: any) => {
        if (value) {
            setBlock(false);
            setStartDate(value[0]);
            setEndDate(value[1]);
        } else {
            setBlock(true);
        }
    };

    return (
        <>
            <Popover
                content={
                    <div>
                        <div style={{ marginBottom: '10px' }}>Chọn khoảng thời gian cần tìm:</div>
                        <RangePicker
                            defaultValue={[
                                moment(startDate, dateFormat),
                                moment(endDate, dateFormat),
                            ]}
                            format={dateFormat}
                            onChange={onChange}
                        />
                        <div style={{ textAlign: 'right', marginTop: '10px' }}>
                            <Button
                                type='primary'
                                danger
                                style={{ marginRight: 10 }}
                                onClick={() => handleClick(false)}
                            >
                                Hủy
                            </Button>
                            <Button
                                type='primary'
                                onClick={() => handleClick(true)}
                                disabled={block}
                            >
                                Lọc
                            </Button>
                        </div>
                    </div>
                }
                placement='topLeft'
                trigger='click'
                visible={visible}
                onVisibleChange={toggle}
            >
                <div>
                    <SidebarItem
                        menu={{
                            icon: <TableOutlined />,
                            title: 'Tìm theo thời gian',
                            active: 'date',
                        }}
                        selected={selected}
                    />
                </div>
            </Popover>
        </>
    );
};

export default FilterDate;
