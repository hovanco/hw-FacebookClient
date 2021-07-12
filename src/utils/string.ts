export function parsePhoneNumber(message: string): string | undefined {
    const regex = /.*((0|\+84)[0-9]{9}).*/;
    const result = message && message.replace(/(\.|\s)/g, '').match(regex);
    if (result) {
        return result[1];
    }
    return;
}

export function removeAccents(string: string): string {
    return string
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
}

export function keywordRegex (keyword: string) {
    return new RegExp(`(?<=[\\s,.:;"']|^)${keyword}(?=[\\s,.:;"']|$)`, 'iu');
}
