import { maxBy } from 'lodash';
import moment from 'moment';
import React, {
    createContext,
    FC,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { useSelector } from 'react-redux';
import { AliasPackage, EBillingPackageType, getPackagesActive } from '../../api/billing-api';
import { IPackage } from '../../collections/billing';
import { checkWarningExpiration } from '../../utils/get-time';

interface Props {
    children?: any | null;
}

interface IPackageDetail {
    active: boolean;
    bonusPeriod: number;
    createdAt: string;
    expiredAt: string;
    packageType: number;
    paymentType: number;
    period: number;
    storeId: string;
    total: number;
    transactionCode: string;
    updatedAt: string;
    id: string;
}

interface IContext {
    isExpired: boolean;
    isTrial: boolean;
    handleCloseBannerTrial: React.Dispatch<any>;
    handleCloseBannerFacebook: React.Dispatch<any>;
    expiredPackage?: number;
    listNamePackage: string[];
    expiredTrial?: string;
}

const initialContext = {
    isExpired: false,
    isTrial: false,
    handleCloseBannerTrial: () => {},
    handleCloseBannerFacebook: () => {},
    expiredPackage: undefined,
    listNamePackage: [],
    expiredTrial: undefined,
};

const Context = createContext<IContext>(initialContext);

const ExpriedPackageContext: FC<Props> = ({ children }): JSX.Element => {
    const store = useSelector((state: any) => state.store.store);
    const [isExpired, setIsExpired] = useState<boolean>(false);
    const [expiredPackage, setExpiredPackage] = useState<number>();
    const [listNamePackage, setListNamePackage] = useState<Array<string>>([]);
    const [expiredTrial, setExpiredTrial] = useState<string>();
    const [isTrial, setIsTrial] = useState<boolean>(false);

    const handleCheckPackageType = (packages: IPackage[]) => {
        packages.forEach((item: IPackageDetail) => {
            if (item.packageType & EBillingPackageType.Trial) {
                setIsTrial(checkWarningExpiration(item.expiredAt));
                setExpiredTrial(item.expiredAt);
                setIsExpired(false);
            }
        });
    };

    const handelGetMaxExpiredAt = (packages: IPackage[]) => {
        let selectedRows: IPackage[] = [];
        packages.filter((element: IPackageDetail) => {
            if (
                element.packageType & EBillingPackageType.Omni ||
                element.packageType & EBillingPackageType.Trial ||
                element.packageType & EBillingPackageType.Facebook
            )
                selectedRows.push(element);
        });
        const packageMaxExpired: IPackageDetail = maxBy(selectedRows, function (o) {
            return Math.round(moment(o.expiredAt).diff(moment(), 'days', true));
        });
        setIsExpired(checkWarningExpiration(packageMaxExpired?.expiredAt));
        setExpiredPackage(
            Math.round(moment(packageMaxExpired?.expiredAt).diff(moment(), 'days', true)),
        );
        if (!checkWarningExpiration(packageMaxExpired?.expiredAt)) {
            return;
        }
        let listName: Array<string> = [];
        selectedRows.forEach((item: IPackageDetail) => {
            if (item.packageType & EBillingPackageType.Omni) {
                listName.push(AliasPackage[EBillingPackageType.Omni]);
            }
            if (item.packageType & EBillingPackageType.Facebook) {
                listName.push(AliasPackage[EBillingPackageType.Facebook]);
            }
        });
        setListNamePackage(listName);
    };

    const getPackages = async () => {
        const packages: IPackage[] = await getPackagesActive(store._id);
        handelGetMaxExpiredAt(packages);
        handleCheckPackageType(packages);
    };
    useEffect(() => {
        getPackages();
    }, []);

    const handleCloseBannerTrial = useCallback(() => {
        setIsTrial(false);
    }, []);

    const handleCloseBannerFacebook = useCallback(() => {
        setIsExpired(false);
    }, []);

    const values = useMemo(
        () => ({
            isExpired,
            isTrial,
            handleCloseBannerTrial,
            handleCloseBannerFacebook,
            expiredPackage,
            listNamePackage,
            expiredTrial,
        }),
        [
            isExpired,
            isTrial,
            handleCloseBannerTrial,
            handleCloseBannerFacebook,
            expiredPackage,
            listNamePackage,
            expiredTrial,
        ],
    );

    return <Context.Provider value={values}>{children}</Context.Provider>;
};

const useExpriedPackage = () => {
    const context = useContext(Context);

    return { ...context };
};

export { ExpriedPackageContext, useExpriedPackage };
