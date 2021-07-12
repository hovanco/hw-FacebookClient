export interface IPackage {
    id: string;
    active: boolean;
    period: number;
    bonusPeriod: number;
    packageType: number;
    storeId: string;
    paymentType: number;
    transactionCode: string;
    total: number;
    createdAt: string;
    updatedAt: string;
    expiredAt: string;
}
