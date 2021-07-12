export interface IFacebookConversation {
    _id: string;
    fbObjectId: string;
    type: number;
    message: string;
    postId?: string;
    commentIds?: string[];
    fbUserId: string;
    fbUsername: string;
    labelIds?: any[];
    fbPageId: any;
    unread: boolean;
    replied?: boolean;
    hasPhoneNo: boolean;
    phoneNo: string;
    blocked?: boolean;
    updatedAt: string;
    createdAt: string;
    hiddenComments?: any;
    likedComments?: any;
}

export enum ConversationType {
    Message = 1,
    Comment = 2,
}
