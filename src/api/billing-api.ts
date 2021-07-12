import { IPackage } from '../collections/billing';
import axiosClient from './axios-client';

export enum EBillingPackageType {
    Trial = 1 << 0,
    Omni = 1 << 1,
    Pos = 1 << 2,
    Facebook = 1 << 3,
    Shopee = 1 << 4,
}

export const AliasPackage = {
    [EBillingPackageType.Pos]: 'INSA POS',
    [EBillingPackageType.Facebook]: 'INSA FACEBOOK',
    [EBillingPackageType.Trial]: 'INSA TRIAL',
    [EBillingPackageType.Shopee]: 'INSA SHOPEE',
    [EBillingPackageType.Omni]: 'OMNI',
};

export async function getPackagesActive(idStore: string): Promise<IPackage[]> {
    const response = await axiosClient({
        method: 'GET',
        url: `/store/v1/stores/${idStore}/billing-stores`,
    });

    return response.data;
}
