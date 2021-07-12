import axiosClient from './axios-client';
import { IImage } from '../collections/image';
import { IMG_URL } from '../configs/vars';

async function loadPageConversations({
    storeId,
    token,
    fbPageId,
    query,
    url,
}: {
    storeId: string;
    token: string;
    fbPageId: string;
    query?: string;
    url?: string;
}): Promise<any> {
    const base_url = `/social-network/v1/stores/${storeId}/facebook-conversations/pages/${fbPageId}/conversations`;

    const response = await axiosClient({
        method: 'GET',
        url: url ? `/social-network/${url}` : query ? `${base_url}?limit=20&${query}` : base_url,
    });

    return response.data;
}

// load conversations
export async function loadConversation({
    storeId,
    token,
    fbPageIds,
    query,
    url,
}: {
    storeId: string;
    token: string;
    fbPageIds: string[];
    query?: string;
    url?: string;
}): Promise<any> {
    const response = await Promise.all(
        fbPageIds.map(async (fbPageId: string) => {
            const page_conversations = await loadPageConversations({
                storeId,
                token,
                fbPageId,
                query,
                url,
            });

            return page_conversations || [];
        })
    );

    return response[0];
}

// load comments
export async function loadComments({
    storeId,
    fbPageId,
    conversationId,
    token,
    next,
}: {
    storeId: string;
    fbPageId: string;
    conversationId: string;
    token: string;
    next?: string;
}) {
    let url = `/social-network/v1/stores/${storeId}/facebook-conversations/pages/${fbPageId}/conversations/${conversationId}/comments?limit=20`;
    if (next) {
        url = `/social-network/${next}`;
    }

    const option: any = {
        method: 'GET',
        url,
    };

    const response = await axiosClient(option);

    return response.data;
}

// load messages
export async function loadMessages({
    storeId,
    fbPageId,
    fbObjectId,
    token,
    next,
}: {
    storeId: string;
    fbPageId: string;
    fbObjectId: string;
    token: string;
    next?: string;
}): Promise<any> {
    let url = `/social-network/v1/stores/${storeId}/facebook-conversations/pages/${fbPageId}/conversations/${fbObjectId}/messages?limit=20`;
    if (next) {
        url = `/social-network/${next}`;
    }

    const response = await axiosClient({
        method: 'GET',
        url,
    });

    return response.data;
}

// reply comment or message
export async function sendReply({
    storeId,
    fbPageId,
    token,
    text = '',
    id,
    fbObjectId,
    type,
    images,
}: {
    storeId: string;
    fbPageId: string;
    token: string;
    text?: string;
    id: string;
    fbObjectId?: string;
    type: number;
    images?: IImage[];
}): Promise<any> {
    const baseUrl = `/social-network/v1/stores/${storeId}/facebook-conversations/pages`;

    const urlMessage = `${baseUrl}/${fbPageId}/messages`;
    const urlComment = `${baseUrl}/${fbPageId}/comments/${fbObjectId}/reply`;
    const url = type === 1 ? urlMessage : urlComment;

    // send message
    if (type === 1) {
        // send message text
        const sendMessageText = async () => {
            if (!text || text.length === 0) return null;

            const dataMessage = {
                message: {
                    text,
                },
                recipient: { id },
            };

            return await axiosClient({
                method: 'POST',
                url,
                data: dataMessage,
            });
        };

        // send images
        const sendImages = async () => {
            if (!images) return null;

            return await Promise.all(
                images.map(async (image: IImage) => {
                    const data = {
                        message: {
                            attachment: {
                                type: 'IMAGE',
                                payload: {
                                    url: `${IMG_URL}${image?.key}`,
                                },
                            },
                        },
                        recipient: { id },
                    };

                    return await axiosClient({
                        method: 'POST',
                        url,
                        data,
                    });
                })
            );
        };

        const reponse = await Promise.all([sendImages(), sendMessageText()]);

        return reponse;
    }

    if (type === 2) {
        const sendCommentText = async () => {
            if (!text || text.length === 0) return null;

            const dataComment = {
                message: text,
            };

            return await axiosClient({
                method: 'POST',
                url,
                data: dataComment,
            });
        };

        // send images
        const sendCommentImages = async () => {
            if (!images) return null;

            return await Promise.all(
                images.map(async (image: IImage) => {
                    const data = {
                        attachment_url: `${IMG_URL}${image.key}`,
                    };

                    return await axiosClient({
                        method: 'POST',
                        url,
                        data,
                    });
                })
            );
        };

        const reponse = await Promise.all([sendCommentImages(), sendCommentText()]);

        return reponse;
    }
}

// like comment
export async function likeComment({
    storeId,
    fbPageId,
    commentId,
    token,
    data,
}: {
    storeId: string;
    fbPageId: string;
    commentId: string;
    token: string;
    data: {
        fbConversationId: string;
    };
}) {
    const url = `/social-network/v1/stores/${storeId}/facebook-conversations/pages/${fbPageId}/comments/${commentId}/likes`;

    const response = await axiosClient({
        method: 'POST',
        url,
        data,
    });

    return response.data;
}

// delete comment
export async function deleteComment({
    storeId,
    fbPageId,
    commentId,
    token,
    conversationId,
}: {
    storeId: string;
    fbPageId: string;
    commentId: string;
    token: string;
    conversationId: string;
}) {
    const url = `/social-network/v1/stores/${storeId}/facebook-conversations/pages/${fbPageId}/comments/${commentId}`;

    const response = await axiosClient({
        method: 'DELETE',
        url,
        data: {
            conversationId,
        },
    });

    return response.data;
}

// hide comment
export async function hideComment({
    storeId,
    fbPageId,
    commentId,
    token,
    isHidden,
    fbConversationId,
}: {
    storeId: string;
    fbPageId: string;
    commentId: string;
    token: string;
    isHidden: boolean;
    fbConversationId: string;
}) {
    const url = `/social-network/v1/stores/${storeId}/facebook-conversations/pages/${fbPageId}/comments/${commentId}/hidden`;

    const response = await axiosClient({
        method: 'PUT',
        url,
        data: {
            isHidden,
            fbConversationId,
        },
    });

    return response.data;
}

// send private reply
export async function sendPrivateReply({
    storeId,
    fbPageId,
    token,
    text,
    commentId,
}: {
    storeId: string;
    fbPageId: string;
    token: string;
    text: string;
    commentId: string;
}) {
    const url = `/social-network/v1/stores/${storeId}/facebook-conversations/pages/${fbPageId}/comments/${commentId}/private-reply`;

    const response = await axiosClient({
        method: 'POST',
        url,
        data: {
            message: text,
        },
    });

    return response.data;
}

// get detail post_id
export async function getDetailPost({
    storeId,
    fbPageId,
    postId,
    token,
}: {
    storeId: string;
    fbPageId: string;
    postId: string;
    token: string;
}) {
    const url = `/social-network/v1/stores/${storeId}/facebook-conversations/pages/${fbPageId}/posts/${postId}`;

    const response = await axiosClient({
        method: 'GET',
        url,
    });

    return response.data;
}

// mark as unread
export async function markAsUnreadApi({
    storeId,
    fbPageId,
    conversationId,
    token,
    read,
}: {
    storeId: string;
    fbPageId: string;
    conversationId: string;
    token: string;
    read: boolean;
}) {
    const url = `/social-network/v1/stores/${storeId}/facebook-conversations/pages/${fbPageId}/conversations/${conversationId}/mark-as-read`;

    const response = await axiosClient({
        method: 'PUT',
        url,
        data: {
            read,
        },
    });

    return response.data;
}

// set / unset labels
export async function labelConversationApi({
    storeId,
    fbPageId,
    conversationId,
    token,
    action,
    labelId,
}: {
    storeId: string;
    fbPageId: string;
    conversationId: string;
    token: string;
    action: string;
    labelId: string;
}) {
    const url = `/social-network/v1/stores/${storeId}/facebook-conversations/pages/${fbPageId}/conversations/${conversationId}/labels/${action}`;

    const response = await axiosClient({
        method: 'PUT',
        url,
        data: {
            labelId,
        },
    });

    return response.data;
}

// get unread conversations count
export async function getUnreadConversationsCount({
    token,
    storeId,
    fbPageId,
}: {
    token: string;
    storeId: string;
    fbPageId: string;
}) {
    const url = `/social-network/v1/stores/${storeId}/facebook-conversations/pages/${fbPageId}/conversations/unread`;

    const response = await axiosClient({
        method: 'GET',
        url,
    });

    return response.data;
}

// toggle block user of conversation
export async function toggleBlockUser({
    pageId,
    userId,
    storeId,
    token,
    blocked,
}: {
    pageId: string;
    userId: string;
    storeId: string;
    token: string;
    blocked: boolean;
}) {
    const base_url = `/social-network/v1/stores/${storeId}/facebook-pages/${pageId}/user/${userId}`;
    const url = blocked ? `${base_url}/block` : `${base_url}/unblock`;
    const method = blocked ? 'POST' : 'DELETE';

    const response = await axiosClient({
        method,
        url,
    });

    return response.data;
}
