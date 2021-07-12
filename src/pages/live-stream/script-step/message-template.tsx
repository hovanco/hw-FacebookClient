import { QuestionCircleOutlined } from '@ant-design/icons';
import { Checkbox, Tooltip } from 'antd';
import React from 'react';
import { useNewLiveStream } from './context';
import SelectReply from './select-reply';

interface Props {}

export const templatesMessage = [
    {
        text: `Cảm ơn quý khách {{Name}} đã đặt hàng, bạn vui lòng xác nhận đồng ý nhận hàng và gửi lại giúp shop địa chỉ nhận hàng để shop hoàn thiện thông tin gửi hàng cho bạn nhé.`,
        title: 'Mẫu 1',
        id: '1',
    },
    {
        text: `Cảm ơn quý khách {{Name}} đã đặt hàng, đơn hàng của quý khách đã được tạo thành công, quý khách vui lòng xác nhận đồng ý nhận hàng để shop gửi về ạ.`,
        title: 'Mẫu 2',
        id: '2',
    },
    {
        text: `Chào bạn, đơn hàng của bạn đã được tạo thành công. Nếu đồng ý nhận hàng, bạn vui lòng gửi tin nhắn xác nhận giúp shop nhé.`,
        title: 'Mẫu 3',
        id: '3',
    },
];

const MessageTemplate = (props: Props) => {
    const { livestream, setMessageTemplate } = useNewLiveStream();

    const changeMessageTemplate = (text: string) => {
        setMessageTemplate(text);
    };

    return (
        <div>
            <p style={{ color: '#1890ff', fontWeight: 500 }}>
                Soạn nội dung tin nhắn gửi cho khách
            </p>

            <SelectReply
                templates={templatesMessage}
                changeTemplate={changeMessageTemplate}
                text={livestream.messageTemplate}
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

export default MessageTemplate;
