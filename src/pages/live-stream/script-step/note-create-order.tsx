import React from 'react';
import { Card } from 'antd';
import { useNewLiveStream } from './context';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import CardTitle from './card-title';

interface Props {}

const NoteCreateOrder = (props: Props) => {
    const { livestream } = useNewLiveStream();
    return (
        <Card type='inner' title={<CardTitle title='Xem trước cú pháp' />} className='card-help'>
            <p>
                Cú pháp để khách hàng có thể đặt đơn theo thiết lập của bạn với từ khóa "QUẦN JEAN"
                sẽ là:
            </p>
            <p>
                <span style={{ color: '#0872d7', fontWeight: 500 }}>
                    QUẦN JEAN {`${livestream.syntax === 1 ? '+ Số điện thoại' : ''}`}
                </span>
            </p>

            <p>Ví dụ về một số bình luận của khách hàng:</p>

            <p>
                <CheckOutlined style={{ color: '#0b954c', marginRight: 10 }} />
                <span style={{ color: '#101025' }}>
                    QUẦN JEAN{`${livestream.syntax === 1 ? ' 098xxxxxx' : ''}`}:
                </span>{' '}
                <span style={{ color: '#0b954c' }}>Đúng cú pháp, đơn hàng được tạo</span>
            </p>

            {livestream.syntax === 1 && (
                <p>
                    <CloseOutlined style={{ color: '#f53d2d', marginRight: 10 }} /> QUẦN jean:{' '}
                    <span style={{ color: '#f05050' }}>Sai cú pháp do thiếu số điện thoại</span>
                </p>
            )}

            <p>
                <CloseOutlined style={{ color: '#f53d2d', marginRight: 10 }} /> QUẦN
                {`${livestream.syntax === 1 ? ' 098xxxxxx' : ''}`}:{' '}
                <span style={{ color: '#f05050' }}>Sai cú pháp do sai từ khóa</span>
            </p>
        </Card>
    );
};

export default NoteCreateOrder;
