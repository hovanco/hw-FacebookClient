import React, { useState, useEffect } from 'react';
import ScriptStep from '../script-step';
import { useParams } from 'react-router-dom';
import { Loading } from '../../../components';
import livestreamApi from '../../../api/livestream-api';
import { useSelector } from 'react-redux';

interface Props {}
interface Params {
    fbPageId?: string;
    scriptId?: string;
}

const ScriptEdit = (props: Props) => {
    const store = useSelector((state: any) => state.store.store);
    const [loading, setLoading] = useState(true);
    const [script, setScript] = useState(true);
    const params = useParams<Params>();

    useEffect(() => {
        async function loadScript({ scriptId, fbPageId }: { scriptId: string; fbPageId: string }) {
            try {
                setLoading(true);
                const response = await livestreamApi.loadScript({
                    storeId: store._id,
                    scriptId,
                    fbPageId,
                });
                setScript(response);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }
        if (params.fbPageId && params.scriptId) {
            loadScript({ scriptId: params.scriptId, fbPageId: params.fbPageId });
        }
    }, []);

    if (loading) return <Loading />;

    if (!params.fbPageId || !params.scriptId || !script) {
        return <div>No script</div>;
    }

    return <ScriptStep script={script} />;
};

export default ScriptEdit;
