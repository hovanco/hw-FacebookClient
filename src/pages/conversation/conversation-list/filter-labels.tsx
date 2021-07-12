import { Modal } from 'antd';
import { map } from 'lodash';
import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { TagIcon } from '../../../assets/icon';
import { ILabel } from '../../../collections/label';
import { Loading } from '../../../components';
import useModal from '../../../hooks/use-modal';
import FilterBarItem from './filter-bar-item';

interface Props {
    selected: string[];
    onClick: (value: string, action: string, active: string) => void;
}

const FilterLabel: FC<Props> = ({ selected, onClick }): JSX.Element => {
    const labelsSetting = useSelector((state: any) => state.label.labels);
    const loading = useSelector((state: any) => state.label.loading);

    const [label, setLabel] = useState<string>('');
    const { visible, toggle } = useModal();

    const handleClick = (isFiltered: boolean) => {
        if (Object.keys(labelsSetting).length > 0) {
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
            opacity: label === labelData._id ? 1 : 0.5,
        };
    };

    const renderLabels = () => {
        if (loading) return <Loading />;

        if (Object.keys(labelsSetting).length === 0) return <span>Không có nhãn hội thoại.</span>;

        return (
            <div className='labels-all'>
                {map(labelsSetting, (label: ILabel) => (
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
        );
    };

    return (
        <>
            <FilterBarItem
                onClick={toggle}
                menu={{
                    icon: <TagIcon />,
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
                {renderLabels()}
            </Modal>
        </>
    );
};

export default FilterLabel;
