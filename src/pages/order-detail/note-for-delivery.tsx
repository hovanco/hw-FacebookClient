import React from 'react';
import { Select } from 'antd';

interface Props {
    noteForDelivery?: string;
    changeNoteForDelivery: (noteForDelivery: string) => void;
    disabled?: boolean;
}

interface Note {
    value: string;
    title: string;
}

const notes: Note[] = [
    {
        value: 'CHOTHUHANG',
        title: 'Cho thử hàng',
    },
    {
        value: 'CHOXEMHANGKHONGTHU',
        title: 'Cho xem hàng, không cho thử',
    },
    {
        value: 'KHONGCHOXEMHANG',
        title: 'Không cho xem hàng',
    },
];

const NoteForDelivery = ({
    noteForDelivery,
    changeNoteForDelivery,
    disabled,
}: Props): JSX.Element => {
    const onChange = (e: any) => {
        changeNoteForDelivery(e);
    };

    return (
        <Select
            onChange={onChange}
            value={noteForDelivery}
            placeholder='Chọn ghi chú vận chuyển'
            disabled={disabled}
        >
            {notes.map((note: Note) => (
                <Select.Option value={note.value} key={note.value}>
                    {note.title}
                </Select.Option>
            ))}
        </Select>
    );
};

export default NoteForDelivery;
