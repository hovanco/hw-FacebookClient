export interface ILivestreamComment {
    _id: string;
    scriptId: string;
    videoId: string;
    fbUserId: string;
    fbUserName: string;
    fbObjectId: string;
    message: string;
    phoneNo?: string;
    orderId?: string;
    isValid?: boolean;
    createdAt: any;
    updatedAt: any;
}
