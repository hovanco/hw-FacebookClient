import { keyBy, set, isEmpty } from 'lodash';
import types from './fanpageTypes';
import { isActivePage } from './fanpageAction';
import { IFacebookPage } from '../../collections/facebook-page';
import { ConversationType, IFacebookConversation } from '../../collections/facebook-conversation';

export interface IAction {
    type: string;
    payload: any;
}

export interface Page extends IFacebookPage {
    countUnread: number;
    picture: string;
}

export interface IConversation extends IFacebookConversation {}

export interface IFacebookState {
    loading: boolean;
    loading_conversation: boolean;
    pages: any;
    allPages: any;
    conversations: IFacebookConversation[];
    iniData: boolean;
    conversation: any;
    newMessage: any;
    originSocketMessage: any;
    page: Page;
    error: boolean;
    isUpdateMessage: boolean;
    next: string;
    filterConversation: string[];
}

const initialState = {
    loading: true,
    loading_conversation: true,
    pages: {},
    allPages: {},
    conversations: [],
    iniData: false,
    conversation: null,
    newMessage: null,
    originSocketMessage: null,
    page: null,
    error: false,
    isUpdateMessage: true,
    next: null,
    filterConversation: ['all'],
};

const facebookReducer = (state = initialState, action: IAction) => {
    let index = 0;

    switch (action.type) {
        case types.CONNECT_FANPAGE_SUCCESSS:
            return {
                ...state,
                pages: {
                    ...state.pages,
                    ...keyBy(action.payload, '_id'),
                },
                loading: false,
            };

        case types.CONNECT_FANPAGE_FAILED:
            return {
                ...state,
                error: true,
                loading: false,
            };

        case types.REMOVE_ERROR_LOAD_FANPAGES:
            return {
                ...state,
                error: false,
            };

        case types.LOAD_FANPAGES:
            return {
                ...state,
                loading: true,
            };

        case types.SET_NEW_MESSAGE:
            return {
                ...state,
                newMessage: action.payload,
            };

        case types.LOAD_FANPAGES_SUCCESS:
            const pages = action.payload.data.reduce((value: any, o: any) => {
                if (isActivePage(o)) {
                    value[o._id] = o;
                }
                return value;
            }, {});
            const allPages = action.payload.data.reduce((value: any, o: any) => {
                value[o._id] = o;
                return value;
            }, {});

            let page;
            if (!isEmpty(action.payload.activePage)) {
                page = action.payload.activePage;
            } else {
                page = action.payload.data.find((item: any) => isActivePage(item));
            }

            return {
                ...state,
                pages,
                allPages,
                page,
                loading: false,
            };

        case types.LOAD_FANPAGES_FAILED:
            return {
                ...state,
                loading: false,
            };

        case types.LOADING_CONVERSATIONS:
            return { ...state, loading_conversation: true };

        case types.REMOVE_CONVERSATIONS:
            return {
                ...state,
                conversations: [],
                next: null,
            };

        case types.LOAD_CONVERSATIONS_SUCCESS: {
            const { pageSelected, conversations } = action.payload;

            if (pageSelected) {
                const pageSelectedId = pageSelected._id;

                const pages_news = {
                    ...state.pages,
                    [pageSelectedId]: {
                        ...(state.pages as any)[pageSelectedId],
                        countUnread: pageSelected.countUnread,
                    },
                };

                return {
                    ...state,
                    conversations: conversations.data,
                    next: conversations.next,
                    page: pageSelected,
                    pages: pages_news,
                    loading_conversation: false,
                };
            }

            return {
                ...state,
                conversations: state.conversations.concat(conversations.data),
                next: conversations.next,
                loading_conversation: false,
            };
        }

        case types.SELECT_CONVERSATION: {
            const conversations_news = state.conversations.map((c: IConversation) => {
                if (c._id === action.payload._id) {
                    return { ...c, unread: false };
                }
                return c;
            });
            return {
                ...state,
                conversation: action.payload,
                conversations: conversations_news,
            };
        }

        case types.MARK_AS_UNREAD: {
            const conversations_news = state.conversations.map((c: IConversation) => {
                if (c._id === action.payload.conversation._id) {
                    return { ...c, unread: action.payload.unread };
                }
                return c;
            });
            return {
                ...state,
                conversations: conversations_news,
            };
        }

        case types.UPDATE_COUNT_UNREAD_PAGE: {
            const pages_news = Object.keys(state.pages).map((key: string) => {
                const p = JSON.parse(JSON.stringify(state.pages))[key];
                if (p.fbObjectId === action.payload.fbObjectId) {
                    p.countUnread = action.payload.count;
                }
                return p;
            });
            return {
                ...state,
                pages: keyBy(pages_news, '_id'),
            };
        }

        case types.UPDATE_CONVERSATION: {
            const { conversation, newMessage, isUpdateMessage } = action.payload;

            if (state.filterConversation.length > 0 && !state.filterConversation.includes('all')) {
                if (
                    (conversation.type === ConversationType.Message && !state.filterConversation.includes('message')) ||
                    (conversation.type === ConversationType.Comment && !state.filterConversation.includes('comment'))
                ) {
                    return { ...state };
                }
            }

            const pageCurrent: any = state.page;
            if (pageCurrent.fbObjectId === conversation.fbPageId) {
                const conversation_local: any = state.conversation;
                index = state.conversations.findIndex(
                    (o: IConversation) => o._id === conversation._id
                );

                const is_valid = state.conversation && conversation_local._id === conversation._id;

                let conversation_new = {
                    ...conversation,
                    unread:
                        conversation_local &&
                        conversation_local.fbObjectId === conversation.fbObjectId
                            ? false
                            : newMessage.from.id !== pageCurrent.fbObjectId,
                };

                let conversations_new = [];
                const tempConversation: any = state.conversations[index];

                if (index !== -1) {
                    conversation_new = {
                        ...conversation_new,
                        labelIds: tempConversation.labelIds,
                    };
                    state.conversations.splice(index, 1);
                    conversations_new = [conversation_new, ...state.conversations];
                } else {
                    conversations_new = [conversation_new, ...state.conversations];
                }

                return {
                    ...state,
                    conversations: conversations_new,
                    newMessage: is_valid ? newMessage : null,
                    originSocketMessage: newMessage,
                    isUpdateMessage,
                };
            }

            return { ...state };
        }

        case types.UPDATE_LABEL_CONVERSATION: {
            const conversations_news = state.conversations.map((c: IConversation) => {
                if (c._id === action.payload.conversation._id) {
                    let labelIds;
                    if (c.labelIds) {
                        const data = c.labelIds.filter(
                            (item) => item._id === action.payload.label._id
                        );
                        if (data.length > 0) {
                            labelIds = c.labelIds.filter(
                                (item) => item._id !== action.payload.label._id
                            );
                        } else {
                            labelIds = [...c.labelIds, action.payload.label];
                        }
                    } else {
                        labelIds = [action.payload.label];
                    }
                    action.payload.conversation.labelIds = labelIds;
                    return { ...c, labelIds };
                }
                return c;
            });
            return {
                ...state,
                conversation: action.payload.conversation,
                conversations: conversations_news,
            };
        }

        case types.UPDATE_LIKED_COMMENTS_CONVERSATION: {
            const conversations_news = state.conversations.map((c: IConversation) => {
                if (c._id === action.payload.conversationId) {
                    const newLikedComments = { ...c.likedComments };
                    set(newLikedComments, `${action.payload.commentId}`, action.payload.value);
                    return { ...c, likedComments: newLikedComments };
                }
                return c;
            });

            const newConversation: any = state.conversation;
            if (newConversation)
                newConversation.likedComments = {
                    ...newConversation.likedComments,
                    [action.payload.commentId]: action.payload.value,
                };

            return {
                ...state,
                conversations: conversations_news,
                conversation: newConversation,
            };
        }

        case types.UPDATE_HIDDEN_COMMENTS_CONVERSATION: {
            const conversations_news = state.conversations.map((c: IConversation) => {
                if (c._id === action.payload.conversationId) {
                    const newHiddenComments = { ...c.hiddenComments };
                    set(newHiddenComments, `${action.payload.commentId}`, action.payload.value);
                    return { ...c, hiddenComments: newHiddenComments };
                }
                return c;
            });
            return {
                ...state,
                conversations: conversations_news,
            };
        }

        case types.UPDATE_BLOCK_CONVERSATION: {
            const conversations_news = state.conversations.map((c: IConversation) => {
                if (c.fbUserId === action.payload.fbUserId) {
                    return { ...c, blocked: !c.blocked };
                }
                return c;
            });
            return {
                ...state,
                conversations: conversations_news,
            };
        }

        case types.SET_NULL_FOR_CONVERSATION: {
            return {
                ...state,
                conversation: null,
            };
        }

        case types.REMOVE_CONVERSATION: {
            const conversations_news = state.conversations.filter(
                (c: IConversation) => c._id !== action.payload.conversationId
            );
            return {
                ...state,
                conversations: conversations_news,
            };
        }

        case types.UPDATE_MAIN_COMMENT_CONVERSATION: {
            const conversations_news = state.conversations.map((c: IConversation) => {
                if (c._id === action.payload.conversationId) {
                    return {
                        ...c,
                        fbObjectId: action.payload.fbObjectId,
                        commentIds: action.payload.commentIds,
                    };
                }
                return c;
            });
            return {
                ...state,
                conversations: conversations_news,
            };
        }

        case types.SET_CURRENT_PAGE: {
            return {
                ...state,
                page: action.payload,
            };
        }

        case types.SET_FILTER_CONVERSATION: {
            return {
                ...state,
                filterConversation: action.payload,
            };
        }

        default:
            return state;
    }
};

export default facebookReducer;
