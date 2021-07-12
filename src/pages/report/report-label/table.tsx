import { Tag } from 'antd';
import { reduce, toNumber } from 'lodash';
import React, { FC } from 'react';

import TableChart from '../table-chart';

const Table: FC<any> = ({ data }) => {
    if (!data) return <div />;

    const { header, items } = data;
    return (
        <TableChart>
            <thead>
                <tr>
                    <th>Nhãn hội thoại</th>
                    {header.map((date: string) => (
                        <th key={date}>{date.split('/')[0]}</th>
                    ))}
                    <th>Tổng</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item: any, i: number) => {
                    return (
                        <tr key={i}>
                            <th>
                                <Tag
                                    color={item.label.backgroundColor}
                                    style={{ color: item.label.color }}
                                >
                                    {item.label.name}
                                </Tag>
                            </th>
                            {item.days.map((l: any, i: number) => {
                                return <td key={i}>{l}</td>;
                            })}

                            <td>{reduce(item.days, (value, item) => value + toNumber(item), 0)}</td>
                        </tr>
                    );
                })}
            </tbody>
        </TableChart>
    );
};

export default Table;
