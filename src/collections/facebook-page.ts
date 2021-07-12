export interface IFacebookPage {
    _id: string;
    storeId: string;
    name: string;
    fbObjectId: string;
    active?: boolean;
    accessToken: string;
    link?: string;
    expiredAt?: string;
}
