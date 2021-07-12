import { find } from 'lodash';
import moment from 'moment';
import React, { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectPage } from '../../../reducers/livestreamState/livestreamAction';
import { templatesComment } from './comment-template';
import { templatesMessage } from './message-template';
import { templatesWrongKeyword } from './message-template-wrong-keyword';
import { templatesWrongPhone } from './message-template-wrong-phone';

interface Keyword {
    productIds: string[];
    keyword: string;
}

export interface LivestreamType {
    name: string;
    type: 0 | 1;
    keywords: Keyword[];
    syntax: 0 | 1;
    orderCreationType: 0 | 1 | 2;
    autoReplyIfCommentIsCorrect: boolean;
    autoReplyIfCommentIsIncorrect: boolean;
    autoHideComments: boolean;
    commentTemplate: string | undefined;
    messageTemplate: string | undefined;
    messageTemplateForWrongKeyword: string | undefined;
    messageTemplateForWrongPhoneNo: string | undefined;
    active: boolean;
    status: 0 | 1 | 2 | 3 | 4;
    videoId?: string;
    fbPageId: string;
}

const initial_livestream = {
    fbPageId: undefined,
    type: 0,
    videoId: undefined,
    name: undefined,
    keywords: [],
    syntax: 0,
    orderCreationType: 0,
    autoReplyIfCommentIsCorrect: false,
    autoReplyIfCommentIsIncorrect: false,
    autoHideComments: false,
    commentTemplate: undefined,
    messageTemplate: undefined,
    messageTemplateForWrongKeyword: undefined,
    messageTemplateForWrongPhoneNo: undefined,
    active: false,
};

const initialContext = {
    livestream: initial_livestream,
    setLiveStream: (livestream: any) => livestream,
};

const NewLiveStreamContext = createContext(initialContext);

interface Props {
    children: ReactNode;
    script?: any;
}

interface Params {
    fbPageId?: string;
    scriptId?: string;
}

export const NewLiveStreamProvider: FC<Props> = ({ children, script }) => {
    const dispatch = useDispatch();
    const fbPageIdState = useSelector((state: any) => state.livestream.fbPageId);
    const pages = useSelector((state: any) => state.fanpage.pages);

    const [livestream, setLiveStream] = useState<any>(initial_livestream);

    const value = {
        livestream,
        setLiveStream,
    };

    useEffect(() => {
        async function initialSetUpContext() {
            if (script) {
                return setLiveStream(script);
            }
            const page = find(pages, (page: any) => page.fbObjectId === fbPageIdState);

            if (page) {
                const fbPageId = fbPageIdState ? fbPageIdState : page.fbObjectId;
                const name = `Livestream ngày ${moment().format('DD/MM')} page ${page.name}`;

                return setLiveStream({ ...livestream, fbPageId, name });
            }

            const arrPageIds = Object.keys(pages).map((pageId: string) => pageId);

            if (arrPageIds.length > 0) {
                const pageId = arrPageIds[0];
                const fbPageId = pages[pageId].fbObjectId;

                dispatch(selectPage(fbPageId));

                const name = `Livestream ngày ${moment().format('DD/MM')} page ${
                    pages[pageId].name
                }`;

                return setLiveStream({ ...livestream, fbPageId, name });
            }

            return null;
        }

        initialSetUpContext();
    }, [pages]);

    return <NewLiveStreamContext.Provider value={value}>{children}</NewLiveStreamContext.Provider>;
};

export const useNewLiveStream = () => {
    const { livestream, setLiveStream } = useContext(NewLiveStreamContext);
    const pages = useSelector((state: any) => state.fanpage.pages);

    const setFbPageId = (fbPageId: string) => {
        const page = find(pages, (p: any) => p.fbObjectId === fbPageId);

        setLiveStream({
            ...livestream,
            fbPageId,
            name: page
                ? `Livestream ngày ${moment().format('DD/MM')} page ${page.name}`
                : undefined,
        });
    };

    const setNameLiveStream = (name: string) => {
        setLiveStream({
            ...livestream,
            name,
        });
    };

    const setTypeLivestream = (type: boolean) => {
        setLiveStream({
            ...livestream,
            type,
        });
    };

    const addKeyword = (keyword: any) => {
        setLiveStream({
            ...livestream,
            keywords: [...livestream.keywords, keyword],
        });
    };

    const removeKeyword = (keywordIndex: number) => {
        setLiveStream({
            ...livestream,
            keywords: livestream.keywords.filter(
                (keyword: any, index: number) => index !== keywordIndex
            ),
        });
    };

    const updateKeyword = (keyword: any, keywordIndex: number) => {
        const newKeywords = livestream.keywords.map((item: any, index: number) => {
            if (keywordIndex === index) return keyword;
            return item;
        });

        setLiveStream({
            ...livestream,
            keywords: newKeywords,
        });
    };

    const setSyntaxWithPhone = (syntax: number) => {
        const autoReplyIfCommentIsIncorrect = () => {
            if (syntax === 0 && livestream.autoReplyIfCommentIsIncorrect) {
                return false;
            }

            return livestream.autoReplyIfCommentIsIncorrect;
        };
        setLiveStream({
            ...livestream,
            syntax,
            autoReplyIfCommentIsIncorrect: autoReplyIfCommentIsIncorrect(),
        });
    };

    const setOrderCreationType = (orderCreationType: number) => {
        setLiveStream({
            ...livestream,
            orderCreationType,
        });
    };

    const setAutoReplyIfCommentIsCorrect = () => {
        if (!livestream.autoReplyIfCommentIsCorrect) {
            setLiveStream({
                ...livestream,
                autoReplyIfCommentIsCorrect: !livestream.autoReplyIfCommentIsCorrect,
                messageTemplate: templatesMessage[0].text,
                commentTemplate: templatesComment[0].text,
            });
        } else {
            setLiveStream({
                ...livestream,
                autoReplyIfCommentIsCorrect: !livestream.autoReplyIfCommentIsCorrect,
                messageTemplate: undefined,
                commentTemplate: undefined,
            });
        }
    };

    const setAutoReplyIfCommentIsIncorrect = () => {
        if (!livestream.autoReplyIfCommentIsIncorrect) {
            setLiveStream({
                ...livestream,
                autoReplyIfCommentIsIncorrect: !livestream.autoReplyIfCommentIsIncorrect,
                messageTemplateForWrongKeyword: templatesWrongKeyword[0].text,
                messageTemplateForWrongPhoneNo: templatesWrongPhone[0].text,
            });
        } else {
            setLiveStream({
                ...livestream,
                autoReplyIfCommentIsIncorrect: !livestream.autoReplyIfCommentIsIncorrect,
                messageTemplateForWrongKeyword: undefined,
                messageTemplateForWrongPhoneNo: undefined,
            });
        }
    };

    const setAutoHideComments = () => {
        setLiveStream({
            ...livestream,
            autoHideComments: !livestream.autoHideComments,
        });
    };

    const setCommentTemplate = (commentTemplate: string) => {
        setLiveStream({
            ...livestream,
            commentTemplate,
        });
    };

    const setMessageTemplate = (messageTemplate: string) => {
        setLiveStream({
            ...livestream,
            messageTemplate,
        });
    };

    const setTemplateCommentIsCorrect = ({
        commentTemplate,
        messageTemplate,
    }: {
        commentTemplate: string;
        messageTemplate: string;
    }) => {
        setLiveStream({
            ...livestream,
            commentTemplate,
            messageTemplate,
        });
    };

    const setMessageTemplateForWrongKeyword = (messageTemplateForWrongKeyword: string) => {
        setLiveStream({
            ...livestream,
            messageTemplateForWrongKeyword,
        });
    };

    const setMessageTemplateForWrongPhoneNo = (messageTemplateForWrongPhoneNo: string) => {
        setLiveStream({
            ...livestream,
            messageTemplateForWrongPhoneNo,
        });
    };

    const setVideoId = (videoId?: string) => {
        setLiveStream({
            ...livestream,
            videoId,
        });
    };

    const resetLiveStream = () => {
        setLiveStream(initial_livestream);
    };

    return {
        livestream,
        setLiveStream,
        setFbPageId,
        setNameLiveStream,
        setTypeLivestream,
        setSyntaxWithPhone,
        setAutoReplyIfCommentIsCorrect,
        setAutoReplyIfCommentIsIncorrect,
        setAutoHideComments,
        addKeyword,
        removeKeyword,
        updateKeyword,
        setOrderCreationType,
        setTemplateCommentIsCorrect,
        setCommentTemplate,
        setMessageTemplate,
        setMessageTemplateForWrongKeyword,
        setMessageTemplateForWrongPhoneNo,
        setVideoId,
        resetLiveStream,
    };
};
