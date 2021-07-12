import { union } from 'lodash';
import { keywordRegex, parsePhoneNumber } from '../../../utils/string';

const getProductFromKeyword = ({ keywords, text }: { keywords: any[]; text: string }): any[] => {
    let products: any[] = [];

    if (!text) {
        return products;
    }

    keywords.forEach((keyword: any) => {
        const regex = keywordRegex(keyword.keyword);
        if (text.match(regex)) {
            products = union(products, keyword.products);
        }
    });

    return products;
};

export const checkRightSyntax = ({
    keywords,
    text,
    syntax,
}: {
    keywords: any[];
    text: string;
    syntax: number;
}): { valid: boolean; products?: any[]; phoneNo?: string } => {
    const products = getProductFromKeyword({
        keywords,
        text,
    });
    const phone = parsePhoneNumber(text);

    if (products.length === 0) {
        return {
            valid: false,
            products: [],
            phoneNo: phone,
        };
    }

    if (syntax === 1) {
        if (phone) {
            return {
                valid: true,
                products,
                phoneNo: phone,
            };
        }

        return {
            valid: false,
            products,
            phoneNo: phone,
        };
    }

    return {
        valid: true,
        products,
        phoneNo: phone,
    };
};
