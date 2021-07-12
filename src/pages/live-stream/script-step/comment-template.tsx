import React from 'react';
import { useNewLiveStream } from './context';
import SelectReply from './select-reply';

interface Props {}

export const templatesComment = [
    {
        text: `Xin chào {{Name}}, shop cảm ơn bạn đã đặt hàng, bạn vui lòng kiểm tra tin nhắn của shop và xác nhận đơn hàng nhé.`,
        title: 'Mẫu 1',
        id: '1',
    },
    {
        text: `Xin chào {{Name}}, shop đã chốt sản phẩm này cho bạn rồi ạ, bạn vui lòng kiểm tra tin nhắn của shop và xác nhận đơn hàng nhé.`,
        title: 'Mẫu 2',
        id: '2',
    },
    {
        text: `Cảm ơn quý khách {{Name}} đã đặt hàng, quý khách vui lòng kiểm tra tin nhắn để xác nhận lại đơn hàng ạ.`,
        title: 'Mẫu 3',
        id: '3',
    },
];

const CommentTemplate = (props: Props) => {
    const { setCommentTemplate, livestream } = useNewLiveStream();

    const changeCommentTemplate = (text: string) => {
        setCommentTemplate(text);
    };

    return (
        <div style={{ marginBottom: 20 }}>
            <p style={{ color: '#1890ff', fontWeight: 500 }}>Soạn nội dung trả lời bình luận</p>

            <SelectReply
                templates={templatesComment}
                changeTemplate={changeCommentTemplate}
                text={livestream.commentTemplate}
            />
        </div>
    );
};

export default CommentTemplate;
