import { push } from 'connected-react-router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPackagesActive } from '../../../api/billing-api';
import { IPackage } from '../../../collections/billing';
import ExpiredStore from '../../../components/expired-store';
import { checkRestrictAction } from '../../../utils/get-time';
import constants from '../../../constants';

import ScripStep from '../script-step';

interface Props {}

const ScriptNew = (props: Props) => {
    const store = useSelector((state: any) => state.store.store);
    const [visible, setVisible] = useState(false);

    const dispatch = useDispatch();

    const handleCancelPopup = () => {
        setVisible(false);
        dispatch(push('/customer/livestream/scripts'));
    };

    const handleBuyPackage = () => {
        window.open(`${constants.URL_STORE}setting/billings/list`, '_blank');
    };

    const getPackages = async () => {
        const packages: IPackage[] = await getPackagesActive(store._id);
        const pkgsActive = packages.filter((item: any) => item.active);
        setVisible(checkRestrictAction(pkgsActive));
    };

    useEffect(() => {
        getPackages();
    }, []);

    return (
        <>
            <ExpiredStore
                visible={visible}
                onCancel={handleCancelPopup}
                onBuyPackage={handleBuyPackage}
            />
            <ScripStep />
        </>
    );
};

export default ScriptNew;
