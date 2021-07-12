import { TagOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import React, { FC, useState } from 'react';
import { ILabel } from '../../../collections/label';
import useModal from '../../../hooks/use-modal';
import SidebarItem from './sidebar-item';

interface Props {
    selected: string[];
    labels: ILabel[];
    onClick: (value: string, action: string, active: string) => void;
}

const FilterLabel: FC<Props> = ({ selected, onClick, labels }): JSX.Element => {
    const [label, setLabel] = useState<string>('');
    const { visible, toggle } = useModal();

    const handleClick = (isFiltered: boolean) => {
        if (labels.length > 0) {
            if (isFiltered) {
                onClick(label, 'add', 'label');
            } else {
                onClick(label, 'delete', 'label');
                setLabel('');
            }
        }
        toggle();
    };

    const handleClickLabel = (labelData: ILabel) => {
        if (label === labelData._id) {
            setLabel('');
        } else {
            setLabel(labelData._id);
        }
    };

    const style = (labelData: ILabel) => {
        return {
            background: labelData.backgroundColor,
            color: labelData.color,
            opacity: label === labelData._id ? 1 : 0.2,
        };
    };

    return (
        <>
            <SidebarItem
                onClick={toggle}
                menu={{
                    icon: <TagOutlined />,
                    title: 'Tìm theo nhãn hội thoại',
                    active: 'label',
                }}
                selected={selected}
            />

            <Modal
                onCancel={() => handleClick(false)}
                onOk={() => handleClick(true)}
                okText='Lọc'
                cancelText='Hủy'
                visible={visible}
                title='Tìm theo nhãn hội thoại'
            >
                {labels.length > 0 ? (
                    <div className='labels-all'>
                        {labels.map((label) => (
                            <div
                                key={label._id}
                                className='label'
                                style={style(label)}
                                onClick={() => handleClickLabel(label)}
                            >
                                {label.name}
                            </div>
                        ))}
                    </div>
                ) : (
                    <span>Không có nhãn hội thoại.</span>
                )}
            </Modal>
        </>
    );
};

export default FilterLabel;
