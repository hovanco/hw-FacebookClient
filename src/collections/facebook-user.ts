export interface IFacebookUser {
    _id: string;
    fbObjectId: string;
    longLiveToken: string;
    displayName: string;
    ownerId?: string;
    active?: boolean;
}
