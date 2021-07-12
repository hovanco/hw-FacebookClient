import React from 'react';
import { useNewLiveStream } from './context';
import EmptyKeyword from './empty-keyword';
import ListKeyword from './list-keyword';

interface Props {}

const SetupKeyword = (props: Props) => {
    const { livestream } = useNewLiveStream();

    const no_keywords = livestream.keywords.length === 0;

    return (
        <>
            <div style={{ display: no_keywords ? 'block' : 'none' }}>
                <EmptyKeyword />
            </div>
            <div style={{ display: no_keywords ? 'none' : 'block' }}>
                <ListKeyword />
            </div>
        </>
    );
};

export default SetupKeyword;
