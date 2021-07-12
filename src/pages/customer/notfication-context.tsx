import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { values } from 'lodash';
const sound = require('../../assets/messenger-less-loudly.mp3');

const initialContext = {
    count: 0,
    title: '',
    play: () => {},
};

const NotificationContext = createContext<any>(initialContext);

interface Props {
    children: ReactNode;
}
const ProviderNotification = ({ children }: Props) => {
    const pages = useSelector((state: any) => state.fanpage.pages);

    const [count, setCount] = useState<number>(0);
    const [title, setTitle] = useState<string>(() => (count === 0 ? '' : `${count}`));

    const audio = new Audio(sound.default);
    const play = () => {
        audio.play();
        setCount(count + 1);
    };

    useEffect(() => {
        if (values(pages).length > 0) {
            const arr = values(pages);
            let sum = arr.reduce(function (a, b) {
                return a + b['countUnread'] || 0;
            }, 0);
            setCount(sum);
        }
    }, [pages]);

    useEffect(() => {
        const new_title = count === 0 ? '' : `(${count > 99 ? '99+' : count})`;
        setTitle(new_title);
    }, [count]);

    const value = {
        count,
        title,
        play,
    };

    return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

const useNotification = () => {
    const value = useContext(NotificationContext);

    return {
        ...value,
    };
};

export { ProviderNotification, useNotification };
