import React, { FC } from 'react';
import TableChart from '../table-chart';

const Table: FC<any> = ({ data }) => {
    if (!data) return <div />;

    const { header, items } = data;
    return (
        <TableChart>
            <thead>
                <tr>
                    <th>Ngày</th>
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
                                <span
                                    style={{
                                        padding: '2px 5px',
                                        borderRadius: 2,
                                        display: 'inline-block',
                                    }}
                                >
                                    {item.displayName}
                                </span>
                            </th>
                            {item.days.map((l: any, i: number) => {
                                return <td key={i}>{l}</td>;
                            })}

                            <td>{item.total}</td>
                        </tr>
                    );
                })}
            </tbody>
        </TableChart>
    );
};

export default Table;
