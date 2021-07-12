import React, { useState } from 'react';
import { Row, Col } from 'antd';
import ConsversationSearch from './converstion-search';
import FilterBar from './filter-bar';
import { MediaMixerIcon } from '../../../assets/icon';

interface Props {}

const ConversationFilter = (props: Props) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [filterSelected, setFilterSelected] = useState<Array<String>>([]);

    const toggle = () => {
        setVisible(!visible);
    };

    return (
        <>
            <div className='conversation-filter'>
                <Row gutter={15} align='middle'>
                    <Col style={{ flex: 1 }}>
                        <ConsversationSearch />
                    </Col>

                    <Col>
                        <div
                            onClick={toggle}
                            className={`btn-toggle-filter${
                                filterSelected.length > 0 ? ' active' : ''
                            }`}
                        >
                            <MediaMixerIcon />
                        </div>
                    </Col>
                </Row>
            </div>

            <FilterBar visible={visible} onChange={setFilterSelected} />
        </>
    );
};

export default ConversationFilter;
