export const validatePhone = (_: any, value: any, callback: any) => {
    if (value) {
        const vnf_regex = /^(0|\+84)(9|3|7|8|5){1}([0-9]{8})$/g;
        if (vnf_regex.test(value) === false) {
            callback('Vui lòng nhập số điện thoại hợp lệ');
        } else {
            callback();
        }
    } else {
        callback();
    }
};
