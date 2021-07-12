import { pick } from 'lodash';
import React, { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { loadComments, loadMessages } from '../../../api/conversation-api';
import { ILabel } from '../../../collections/label';
import { IAuthState } from '../../../reducers/authState/authReducer';
import { IConversation, IFacebookState } from '../../../reducers/fanpageState/fanpageReducer';
import { IStoreState } from '../../../reducers/storeState/storeReducer';

export interface Message {
    from: { name: string; email: string; id: string };
    created_time: string;
    id: string;
    message: string;
    attachments?: {
        data: any[];
    };
    type?: number;
    parent?: any;
}

export interface Comment {
    created_time: string;
    from: {
        id: string;
        name?: string;
    };
    id: string;
    message: string;
    type?: number;
    text: string;
    parent?: any;
}

interface IState {
    loading: boolean;
    messages: any | never[];
}

const initialState = {
    loading: false,
    messages: [] as Message[],
    postContent: '',
    text: '',
    textChat: '',
    labels: [] as ILabel[],
    labelIds: [] as any[],
    images: [],
    message_sending: [],
    images_sending: [],
    isFocus: false,
    next: '',
    isNewMessage: false,
};

const initialContext = {
    state: initialState,
    setState: (state: any): any => state,
};

const Context = createContext(initialContext);

interface Props {
    children: ReactNode;
}
type Item = Comment | Message;

const formatMessages = ({ arr, type }: { arr: any[]; type: number }): any =>
    arr.map((item: any) => ({ ...item, type }));

const ProviderContext: FC<Props> = ({ children }) => {
    const conversation: IConversation = useSelector(
        ({ fanpage }: { fanpage: IFacebookState }) => fanpage.conversation
    );

    const originSocketMessage: any = useSelector(
        ({ fanpage }: { fanpage: IFacebookState }) => fanpage.originSocketMessage
    );

    const store = useSelector(({ store }: { store: IStoreState }) => store.store);

    const token: any = useSelector(({ auth }: { auth: IAuthState }) => auth.token);

    const labelsSetting = useSelector((state: any) => state.label.labels);

    const [state, setState] = useState(initialState);

    const toggleLoading = (value: boolean) => setState({ ...state, loading: value, messages: [] });

    useEffect(() => {
        toggleLoading(true);
        async function loadCoversationList() {
            toggleLoading(true);
            try {
                const labels = Object.keys(labelsSetting).map((key: string) => ({
                    ...labelsSetting[key],
                }));
                if (conversation.type === 1) {
                    const messagesResponse = await loadMessages({
                        ...pick(conversation, ['fbObjectId', 'fbPageId']),
                        storeId: store._id,
                        token: token.accessToken,
                    });

                    const messages = formatMessages({
                        arr: messagesResponse.data,
                        type: 1,
                    }).reverse();

                    return setState({
                        ...state,
                        next: messagesResponse.next,
                        messages,
                        loading: false,
                        postContent: '',
                        labels,
                        labelIds: conversation.labelIds || [],
                    });
                }

                let conversationId = conversation.fbObjectId;
                const commentsResponse = await loadComments({
                    conversationId,
                    ...pick(conversation, ['fbPageId']),
                    storeId: store._id,
                    token: token.accessToken,
                });

                const messages = formatMessages({
                    arr: (commentsResponse.data || []).reverse(),
                    type: 2,
                });
                return setState({
                    ...state,
                    messages,
                    loading: false,
                    postContent: '',
                    labels,
                    labelIds: conversation.labelIds || [],
                    next: commentsResponse.next,
                });
            } catch (error) {
                toggleLoading(false);
            }
        }

        if (conversation) {
            loadCoversationList();
        }
    }, [conversation]);

    const value = { state, setState };
    return <Context.Provider value={value}>{children}</Context.Provider>;
};

const useConversationDetail = () => {
    const value = useContext(Context);

    const { state, setState } = value;

    const setMessages = (messages: Message | Comment) => {
        setState({ ...state, messages });
    };

    const loadMoreMessages = (dataMessages: Message[] | Comment[], next: string) => {
        const messages = [...dataMessages, ...state.messages];
        setState({ ...state, messages, next });
    };

    const updateMessage = (message: any) => {
        const index = (state.messages || []).findIndex((o) => o.id === message.id);
        let messages = [...state.messages];
        if (index === -1) {
            messages = [...state.messages, message];
        }
        setState({ ...state, messages });
    };

    const deleteMessage = (message: { id: string }) => {
        let messages = state.messages.filter((o) => o.id !== message.id);
        messages = messages.filter((o) => !o.parent || (o.parent && o.parent.id !== message.id));
        setState({ ...state, messages });
    };

    const getComments = async (
        conversationId: string,
        fbPageId: string,
        storeId: string,
        token: string
    ) => {
        setState({ ...state, loading: true });
        const commentsResponse = await loadComments({
            conversationId,
            fbPageId,
            storeId,
            token,
        });

        const messages = formatMessages({
            arr: commentsResponse.data,
            type: 2,
        });

        setState({ ...state, messages, next: commentsResponse.next, loading: false });
    };

    const changeText = (text: string) => {
        setState({ ...state, text });
    };

    const changeTextChat = (textChat: string) => {
        setState({ ...state, textChat });
    };

    const updateLabels = (label: ILabel) => {
        const data = state.labelIds.filter((item) => item._id === label._id);
        if (data.length > 0) {
            const labelIds = state.labelIds.filter((item) => item._id !== label._id);
            setState({ ...state, labelIds });
        } else {
            const labelIds = [...state.labelIds, label];
            setState({ ...state, labelIds });
        }
    };

    const setImageSend = (images: any[]) => {
        setState({ ...state, images, isFocus: true });
    };

    const setImageSending = (images: any[]) => {
        setState({ ...state, images_sending: images });
    };

    const changeIsFocus = (value: boolean) => {
        setState({ ...state, isFocus: value });
    };

    const setIsNewMessage = (value: boolean) => {
        setState({ ...state, isNewMessage: value });
    };

    const setIdMessage = (data: any) => {
        const index = (state.messages || []).findIndex((o) => o.id === data.fakeId);
        if (index !== -1) {
            state.messages[index].id = data.realId;
        }
        setState({
            ...state,
            messages: [...state.messages],
        });
    };

    const setMessageSending = (message: any) => {
        setState({
            ...state,
            messages: [...state.messages, message],
            text: '',
            isNewMessage: true,
        });
    };

    const setMessagesSending = (messages: any) => {
        setState({
            ...state,
            messages: [...state.messages, ...messages],
            text: '',
            isNewMessage: true,
        });
    };

    const removeMessageError = (message: any) => {
        const messages = state.messages.filter((m: any) => m.id !== message.id);
        setState({ ...state, messages, text: '' });
    };

    const resetMessageSending = () => {
        setState({ ...state, message_sending: [] });
    };

    return {
        ...state,
        setMessages,
        loadMoreMessages,
        setIsNewMessage,
        updateMessage,
        deleteMessage,
        changeText,
        changeTextChat,
        updateLabels,
        setImageSend,
        changeIsFocus,
        setImageSending,
        setMessageSending,
        resetMessageSending,
        removeMessageError,
        setMessagesSending,
        getComments,
        setIdMessage,
    };
};

export { ProviderContext, useConversationDetail };
