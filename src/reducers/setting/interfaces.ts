import { IFacebookPage } from '../../collections/facebook-page';
import { IQuickAnswer } from '../../collections/quick-answer';

export interface Payload {
    pageId: string;
    data?: any;
    [propsName: string]: any;
}

export interface FanpageStateInterface {
    _id: string;
    storeId: string;
    pageId: string;
    pages: IFacebookPage;
    fbObjectId: string;
}

export interface QuickMessageInterface extends IQuickAnswer {
    pageId?: string;
    storeId?: string;
    mode?: string;
}
