import { message as MessageDesign, Space, Tooltip, Avatar } from 'antd';
import { get, isArray, find } from 'lodash';
import moment from 'moment';
import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { IConversation, IFacebookState, Page } from '../../../reducers/fanpageState/fanpageReducer';
import { Comment, Message } from './context';
import DeleteComment from './delete-comment';
import HideComment from './hide-comment';
import LikeComment from './like-comment';
import ModalChat from './modal-chat';
import { generateUrlImgFb } from '../../../utils/generate-url-img-fb';

interface Props {
    message: Comment | Message | any;
    me?: boolean;
    userId?: string;
    type: number;
    isShowAvatarHere?: boolean;
}

const placement = 'left';

const MessageBubble: FC<Props> = ({
    message,
    me = false,
    userId,
    type,
    isShowAvatarHere = false,
}): JSX.Element => {
    const likedComments: IConversation = useSelector(
        ({ fanpage }: { fanpage: IFacebookState }) => fanpage.conversation.likedComments
    );
    const conversation: IConversation = useSelector(
        ({ fanpage }: { fanpage: IFacebookState }) => fanpage.conversation
    );
    const pages = useSelector(({ fanpage }: { fanpage: IFacebookState }) => fanpage.pages);
    const page = find(pages, (page: Page) => page.fbObjectId === conversation.fbPageId);

    const [liked, setLiked] = useState(get(likedComments, `${message.id}`, false));

    let className = me ? 'item me' : 'item';
    className = liked ? `${className} liked` : className;

    const handleLike = () => setLiked(!liked);

    const renderAction = () => {
        if (type === 2) {
            if (me) {
                return <DeleteComment comment={message as Comment} />;
            }

            return (
                <Space size={10}>
                    {!liked && (
                        <LikeComment
                            comment={message as Comment}
                            handleLike={handleLike}
                            liked={liked}
                        />
                    )}
                    <HideComment comment={message as Comment} />
                    <DeleteComment comment={message as Comment} />
                    <ModalChat
                        name={(message as Comment).from.name || ''}
                        comment={message as Comment}
                    />
                </Space>
            );
        }

        return null;
    };

    const renderText = () => {
        const name = (message as Comment).from?.name;
        const date = (message as Comment).created_time;
        if (name && date) {
            return `${name} - ${moment(date).format('DD-MM-YYYY HH:mm')}`;
        }
        return name ? name : date ? moment(date).format('DD-MM-YYYY HH:mm') : '...';
    };

    const selectText = (node: string) => {
        const elm: HTMLElement | null = document.getElementById(node);
        const documentBody: any = document.body;

        if (documentBody.createTextRange && elm) {
            const range = documentBody.createTextRange();
            range.moveToElementText(elm);
            range.select();
        } else if (window.getSelection && elm) {
            const selection: any = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(elm);
            selection.removeAllRanges();
            selection.addRange(range);
        } else {
            console.warn('Could not select text in node: Unsupported browser.');
        }
    };

    const copyText = (text: string) => {
        selectText(message.id);
        document.execCommand('copy');
        MessageDesign.success('Đã copy nội dung');
    };

    const renderBubbleLike = liked && (
        <div className='bubble_like'>
            <LikeComment comment={message as Comment} handleLike={handleLike} liked={liked} />
        </div>
    );

    const renderMedia = () => {
        if (type === 1) {
            return (
                <>
                    {message.sticker && (
                        <Tooltip placement={placement} title={renderText()}>
                            <img src={message.sticker} className='sticker' alt='' />
                        </Tooltip>
                    )}

                    {message.attachments &&
                        isArray(message.attachments.data) &&
                        message.attachments.data.map((i: any) => {
                            if (i.mime_type === 'video/mp4') {
                                return (
                                    <Tooltip placement={placement} title={renderText()}>
                                        <div
                                            key={i.id}
                                            className={
                                                message.from.id === userId
                                                    ? 'video item-inner img'
                                                    : 'video item-inner item-inner-other img'
                                            }
                                        >
                                            <video
                                                src={i.video_data.url}
                                                poster={i.video_data.preview_url}
                                                preload='auto'
                                                controls
                                            ></video>
                                        </div>
                                    </Tooltip>
                                );
                            }
                            return (
                                <Tooltip placement={placement} title={renderText()} key={i.id}>
                                    <div
                                        key={`${message.id}-mess`}
                                        className={
                                            message.from.id === userId
                                                ? 'item-inner img'
                                                : 'item-inner item-inner-other img'
                                        }
                                    >
                                        <img src={i.image_data.preview_url} alt='' />
                                    </div>
                                </Tooltip>
                            );
                        })}
                </>
            );
        }

        if (type === 2) {
            return (
                <>
                    {message.attachment &&
                        message.attachment.media &&
                        message.attachment.type === 'sticker' && (
                            <Tooltip placement={placement} title={renderText()}>
                                <img
                                    src={message.attachment.media.image.src}
                                    className='sticker'
                                    alt=''
                                />
                            </Tooltip>
                        )}

                    {message.attachment &&
                        message.attachment.media &&
                        (message.attachment.type === 'animated_image_share' ||
                            message.attachment.type === 'photo') && (
                            <>
                                <Tooltip placement={placement} title={renderText()}>
                                    <div style={{ marginTop: 5 }}>
                                        <div
                                            key={`${message.id}-mess`}
                                            className={
                                                message.from.id === userId
                                                    ? 'item-inner img'
                                                    : 'item-inner item-inner-other img'
                                            }
                                        >
                                            <img src={message.attachment.media.image.src} alt='' />
                                        </div>
                                    </div>
                                </Tooltip>
                                <div style={{ position: 'relative' }}>
                                    {renderBubbleLike}
                                </div>
                            </>
                        )}

                    {message.attachment &&
                        message.attachment.media &&
                        message.attachment.type === 'video_inline' && (
                            <>
                                <Tooltip placement={placement} title={renderText()}>
                                    <div
                                        className={
                                            message.from.id === userId
                                                ? 'video item-inner img'
                                                : 'video item-inner item-inner-other img'
                                        }
                                        style={{ marginTop: 5 }}
                                    >
                                        <video
                                            src={message.attachment.media.source}
                                            poster={message.attachment.media.image.src}
                                            preload='auto'
                                            controls
                                        ></video>
                                    </div>
                                </Tooltip>
                                <div style={{ position: 'relative' }}>
                                    {renderBubbleLike}
                                </div>
                            </>
                        )}
                </>
            );
        }

        return null;
    };

    const _message = get(message, 'message', '');

    return (
        <div
            className={className}
            key={message.id}
            style={{ flexDirection: me ? 'row-reverse' : 'row', alignItems: 'center' }}
        >
            {type === 1 ? (
                <div className='content-avatar'>
                    {isShowAvatarHere ? (
                        me ? (
                            <Avatar
                                src={generateUrlImgFb(page.fbObjectId, page.accessToken)}
                                alt={page.name}
                                size={30}
                            />
                        ) : (
                            <Avatar
                                alt={conversation.fbUsername}
                                src={generateUrlImgFb(conversation.fbUserId, page.accessToken)}
                                size={30}
                            />
                        )
                    ) : (
                        ''
                    )}
                </div>
            ) : (
                <></>
            )}

            <div className='content-message'>
                {_message.length > 0 && (
                    <>
                        <Tooltip placement={placement} title={renderText()}>
                            <div
                                key={`${message.id}-mess`}
                                className={
                                    message.from.id === userId
                                        ? 'item-inner'
                                        : 'item-inner item-inner-other'
                                }
                                onDoubleClick={() => copyText(_message)}
                                style={{ paddingBottom: liked ? 12 : 5 }}
                            >
                                <span id={message.id}>{_message}</span>
                            </div>
                        </Tooltip>
                        <div style={{ position: 'relative' }}>
                            {renderBubbleLike}
                        </div>
                    </>
                )}

                {renderMedia()}
            </div>

            <div className='bubble_action'>{renderAction()}</div>
        </div>
    );
};

export default MessageBubble;
