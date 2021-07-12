export enum EScriptType {
    IncomingLivestream = 0,
    EndedLivestream = 1,
}

export enum ECreateOrderSyntax {
    Keyword = 0,
    KeywordAndPhoneNumber = 1,
}

export enum EOrderCreationType {
    OneOrderPerUserImmediately = 0,
    OneOrderPerCommentImmediately = 1,
    LivestreamEnded = 2,
}

export enum EScriptStatus {
    NotInUse = 0,
    InUse = 1,
    CreatingOrder = 2,
    Pending = 3,
    Finished = 4,
}
export interface IKeywordForProducts {
    products: IProduct[];
    keyword: string;
}

export interface IProduct {
    productId: string;
    price: number;
}

export interface IFBVideo {
    id: string;
    title?: string;
    length: number;
    updated_time: string;
    picture: string;
}

export interface ILivestreamScript {
    _id: string;
    storeId: string;
    fbPageId: string;
    name: string;
    type: EScriptType;
    keywords: IKeywordForProducts[];
    syntax: ECreateOrderSyntax;
    orderCreationType: EOrderCreationType;
    autoReplyIfCommentIsCorrect: boolean;
    autoReplyIfCommentIsIncorrect: boolean;
    commentTemplate?: string;
    messageTemplate?: string;
    messageTemplateForWrongKeyword?: string;
    messageTemplateForWrongPhoneNo?: string;
    active: boolean;
    status: EScriptStatus;
    videoId?: string;
    video?: IFBVideo;
    customerCount?: number;
    commentCount?: number;
    orderCount?: number;
    createdAt: any;
    updatedAt: any;
    autoHideComments?: boolean;
}
