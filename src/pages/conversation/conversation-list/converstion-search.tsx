import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CloseIcon, SearchIcon } from '../../../assets/icon';
import {
    loadConversations,
    removeConversations,
} from '../../../reducers/fanpageState/fanpageAction';
import { IStoreState } from '../../../reducers/storeState/storeReducer';

const ConsversationSearch: FC = (): JSX.Element => {
    const [text, setText] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const dispatch = useDispatch();

    const store = useSelector(({ store }: { store: IStoreState }) => store.store);

    const focusInput = React.useCallback((e: any) => {
        if (e.code === 'F3' && inputRef.current) return inputRef.current.focus();

        return null;
    }, []);

    const onChange = (e: { target: { value: React.SetStateAction<string> } }) => {
        setText(e.target.value);
    };

    const clearText = () => setText('');

    const handleSubmit = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        dispatch(removeConversations());
        let fbPageId;
        if (store.activePage) {
            fbPageId = store.activePage.fbObjectId;
        }
        dispatch(loadConversations(`search=${text}`, [fbPageId]));
    };

    useEffect(() => {
        document.addEventListener('keydown', focusInput);

        return () => {
            document.removeEventListener('keydown', focusInput);
        };
    }, [focusInput]);

    return (
        <form className='conversation-search' onSubmit={handleSubmit}>
            <span className='icon search'>
                <SearchIcon style={{ color: '#99a6ad' }} />
            </span>

            <input
                ref={inputRef}
                onChange={onChange}
                type='text'
                value={text}
                placeholder='(F3) Tìm tên hoặc số điện thoại'
            />

            {text.length > 0 && (
                <span className='icon close' onClick={clearText}>
                    <CloseIcon style={{ color: '#99a6ad' }} />
                </span>
            )}
        </form>
    );
};

export default ConsversationSearch;
