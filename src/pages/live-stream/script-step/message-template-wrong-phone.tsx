import React, { useEffect } from 'react';
import { Checkbox, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import SelectReply from './select-reply';
import { useNewLiveStream } from './context';

interface Props {}

export const templatesWrongPhone = [
    {
        text: `Xin chào {{Name}}, Bình luận của bạn: “{{comment livestream}}” đang bị thiếu hoặc sai số điện thoại. Vui lòng chat cho shop số điện thoại của bạn nhé !`,
        title: 'Mẫu 1',
        id: '1',
    },
    {
        text: `Chào {{Name}}, nội dung bình luận của bạn đang bị thiếu hoặc sai số điện thoại. Để đặt hàng bạn vui lòng chat cho shop số điện thoại của bạn nhé! Cảm ơn bạn!`,
        title: 'Mẫu 2',
        id: '2',
    },
    {
        text: `Hi {{Name}}, cảm ơn bạn đã quan tâm đến sản phẩm của shop, để hoàn tất đặt sản phẩm bạn vui lòng gửi cho shop số điện thoại nhé!`,
        title: 'Mẫu 3',
        id: '3',
    },
];

const MessageTemplateWrongPhone = (props: Props) => {
    const { livestream, setMessageTemplateForWrongPhoneNo } = useNewLiveStream();

    const changeMessageTemplateForWrongPhoneNo = (text: string) => {
        setMessageTemplateForWrongPhoneNo(text);
    };

    return (
        <div>
            <p style={{ color: '#1890ff', fontWeight: 500 }}>
                Soạn nội dung tin nhắn gửi khách hàng khi bình luận đúng từ khoá nhưng thiếu hoặc
                sai số điện thoại
            </p>

            <SelectReply
                templates={templatesWrongPhone}
                changeTemplate={changeMessageTemplateForWrongPhoneNo}
                text={livestream.messageTemplateForWrongPhoneNo}
            />

            {/*

            <div style={{ marginTop: 15 }}>
                <p>
                    <Checkbox>
                        Gửi chi tiết đơn hàng của bạn
                        <Tooltip
                            title='Hỗ trợ gửi mẫu tin nhắn kèm trang chi tiết đơn hàng'
                            placement='right'
                        >
                            <QuestionCircleOutlined style={{ marginLeft: 5 }} />
                        </Tooltip>
                    </Checkbox>
                </p>
            </div>
            */}
        </div>
    );
};

export default MessageTemplateWrongPhone;
