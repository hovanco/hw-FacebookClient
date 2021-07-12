import { Col, Row, Tag } from 'antd';
import React, { FC } from 'react';
import { ILabel } from '../../../collections/label';

interface Props {
    label: ILabel;
}

const EditLabel: FC<Props> = ({ label }) => {
    return (
        <>
            <Row gutter={10} align='middle'>
                <Col>
                    <Tag
                        className='tag-label'
                        color={label.backgroundColor}
                        style={{ color: label.color }}
                    >
                        {label.name}
                    </Tag>
                </Col>
            </Row>
        </>
    );
};

export default EditLabel;
