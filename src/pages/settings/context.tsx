import React, { createContext, ReactElement } from 'react';

const initialContext = {
    quickMessage: {},
};
export const SettingContext = createContext(initialContext);

export const ProviderSettingContext = ({ children }: any) => {
    return (
        <SettingContext.Provider value={{ quickMessage: {} }}>{children}</SettingContext.Provider>
    );
};
