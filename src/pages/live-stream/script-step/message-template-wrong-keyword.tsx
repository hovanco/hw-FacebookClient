import React, { useEffect } from 'react';
import SelectReply from './select-reply';
import { useNewLiveStream } from './context';

interface Props {}

export const templatesWrongKeyword = [
    {
        text: `Xin chào {{Name}}, Bình luận của bạn: “{{comment livestream}}” đang bị thiếu hoặc sai từ khóa sản phẩm. Vui lòng chat cho shop sản phẩm bạn muốn đặt mua nhé !`,
        title: 'Mẫu 1',
        id: '1',
    },
    {
        text: `Xin chào {{Name}}, Từ khóa đặt hàng của bạn đang bị thiếu hoặc sai, bạn vui lòng chat cho shop tên sản phẩm bạn muốn đặt mua nhé!`,
        title: 'Mẫu 2',
        id: '2',
    },
    {
        text: `{{Name}} ơi, bình luận của bạn đang bị thiếu hoặc sai từ khóa sản phẩm rồi nhé, bạn vui lòng gửi lại tên mã sản phẩm bạn muốn đặt mua qua inbox cho shop nha! Cảm ơn bạn!`,
        title: 'Mẫu 3',
        id: '3',
    },
];

const MessageTemplateWrongKeyword = (props: Props) => {
    const { setMessageTemplateForWrongKeyword, livestream } = useNewLiveStream();

    const changeMessageTemplateForWrongKeyword = (text: string) => {
        setMessageTemplateForWrongKeyword(text);
    };

    return (
        <div style={{ marginBottom: 20 }}>
            <p style={{ color: '#1890ff', fontWeight: 500 }}>
                Soạn nội dung tin nhắn gửi khách hàng khi bình luận có số điện thoại nhưng thiếu
                hoặc sai từ khóa
            </p>

            <SelectReply
                text={livestream.messageTemplateForWrongKeyword}
                templates={templatesWrongKeyword}
                changeTemplate={changeMessageTemplateForWrongKeyword}
            />
        </div>
    );
};

export default MessageTemplateWrongKeyword;
