import { InfoCircleOutlined } from '@ant-design/icons';
import { Modal, Tag, Tooltip } from 'antd';
import React, { FC } from 'react';
import useModal from '../../../hooks/use-modal';

const ModalHelps: FC = (): JSX.Element => {
    const { visible, toggle } = useModal();

    return (
        <>
            <div onClick={toggle} className='item'>
                <Tooltip title='Phím tắt' placement='top'>
                    <InfoCircleOutlined style={{ fontSize: 21 }} />
                </Tooltip>
            </div>
            <Modal title='Phím tắt' visible={visible} onCancel={toggle} onOk={toggle} footer={null}>
                <div className='shortcuts-modal'>
                    <div>
                        <Tag color='blue'>Enter</Tag> để gửi trả lời.
                    </div>

                    <div>
                        <Tag color='blue'>Shift + Enter</Tag> để xuống dòng.
                    </div>
                    <div>
                        <Tag color='blue'>/ + Số thứ tự + Enter</Tag> để lấy tin nhắn nhanh (số thứ
                        tự trong bảng trả lời nhanh).
                    </div>
                    <div>
                        <Tag color='blue'>Double click</Tag> Nhấn chuột 2 lần (double click) vào 1
                        đoạn chat để copy nội dung của đoạn chat đó.
                    </div>
                    <div>
                        <Tag color='blue'>F3</Tag> Nhấn F3 để nhảy về ô Tìm kiếm khách hàng.
                    </div>
                    <div>
                        <Tag color='blue'>F4</Tag> Nhấn F4 để di chuyển qua lại giữa 2 khung "Khách
                        hàng" và "Đơn hàng".
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ModalHelps;
