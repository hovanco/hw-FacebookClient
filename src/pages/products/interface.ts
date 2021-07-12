export interface IProduct {
    _id: string;
    name: string;
    code: string;
    weight: number;
    length?: number;
    width?: number;
    height?: number;
    price: number;
    originalPrice: number;
    retail_price: number;
    wholesalePrice: number;
    img?: string;
}
