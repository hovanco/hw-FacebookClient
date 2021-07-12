const useHiddenModalExpired = () => {
    const hiddenModalExpired = !!localStorage.getItem('checkLogin');

    const setValueHidden = (value: string) => {
        localStorage.setItem('checkLogin', value);
    };
    const removeValueHidden = () => {
        localStorage.removeItem('checkLogin');
    };

    return {
        hiddenModalExpired,
        setValueHidden,
        removeValueHidden,
    };
};

export default useHiddenModalExpired;
