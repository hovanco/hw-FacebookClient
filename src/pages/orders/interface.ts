export interface IStatus {
    id: string;
    name: string;
}

export interface IProduct {
    id: string;
    img?: string | undefined;
    name: string;
    weight: number;
    quanlity: number;
    price: number;
    quantity_in_stock: number;
}

export interface IShip {
    id: string;
    status: string;
}

export interface IStock {
    id: string;
    name: string;
}

export interface IOrder {
    _id: string;
    key: string;
    date: any;
    order_name: string;
    order_phone: string;
    isDraft?: boolean;
    member: {
        role: 'admin' | 'member';
        displayName: string;
    };
    phi_bao_khach: number;
    phi_van_chuyen: number;
    list_orders: IProduct[];
    status: string;
    ship?: IShip | null;
    stock: IStock;
}
