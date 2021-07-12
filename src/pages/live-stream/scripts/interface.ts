export interface IScript {
    active: boolean;
    autoReplyIfCommentIsCorrect: boolean;
    autoReplyIfCommentIsIncorrect: boolean;
    commentTemplate: string;
    createdAt: string;
    fbPageId: string;
    keywords: Array<any>;
    messageTemplate: string;
    messageTemplateForWrongKeyword: string;
    messageTemplateForWrongPhoneNo: string;
    name: string;
    orderCreationType: number;
    storeId: string;
    syntax: number;
    type: number;
    updatedAt: string;
    __v: number;
    _id: string;
}
