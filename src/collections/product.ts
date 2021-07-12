export interface IProduct {
    _id: string;
    name: string;
    description: string;
    categoryId: string;
    storeId: string;
    originalPrice: number;
    price: number;
    code: string;
    brandId: string;
    unitId: string;
    length: number;
    width: number;
    height: number;
    weight: number;
    images: string[];
}
