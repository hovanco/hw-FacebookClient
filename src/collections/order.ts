import { IProduct } from './livestream-script';
import { IStore } from './store';
import { IWareHouses } from './ware-houses';

export enum EDeliveryServiceIds {
    GHTK = 1,
    GHN = 2,
}

export enum ETransportType {
    Fast = 1,
    Medium,
}

export enum ETransportStatus {
    Picking,
    Picked,
    Storing,
    Delivering,
    Delivered,
    Return,
    Returned,
}

export enum EDeliveryDiscountBy {
    Money,
    Percent,
}

export interface TransportLog {
    status: ETransportStatus;
    updatedAt: Date;
}

export interface DeliveryOptions {
    serviceId: EDeliveryServiceIds; // id of delivery service
    transportType: ETransportType; // transport type, it should be convert to valid value before sending to delivery service
    shipmentOrderId: string; // id of transport service: ghn: order_code, ghtk: label_id
    shipmentFee: number; // Real shipment fee
    shipmentFeeForCustomer: number; // Shipment fee that will be informed to customer
    shipmentFeeByTotal: boolean; // Shipment fee should be included in total fee
    discount: number; // Discount for customer, will be set by user
    discountBy: EDeliveryDiscountBy; // Discount by money or percent
    feeForReceiver: number; // Total amount that receiver need to pay (Total product amount + shipment fee - discount)
    moneyForSender: number; // Total amount that sender will receive (Total product amount + shipment fee for customer - discount - real shipment fee)
    customerNote: string;
    noteForCustomerCare: string;
    transportStatus: ETransportStatus;
    transportLogs: TransportLog[]; // Log all changes of transport status
    noteForDelivery: string;
}

enum ORDER_STATUS {
    NEW,
    CONFIRMED,
    WRAPPED,
    DELIVERING,
    CANCELED,
    PAID,
    RETURNED,
}

export interface IOrer {
    createdBy: string | any;
    storeId: string | IStore;
    warehouseId: string | IWareHouses;
    fbPageId: string;
    isDraft: boolean;
    products: [
        {
            _id: false;
            productId: string | IProduct;
            count: Number;
            price: Number;
        }
    ];
    discountId: { type: string };
    totalPrice: Number;
    customer: {
        _id: string;
        fbUserId: string;
        name: string;
        phoneNo: string;
        address: string;
        province: string;
        district: string;
        ward: string;
        email: string;
    };
    note: string;
    status: ORDER_STATUS;
    paidAt: string;
    code: string;
    deliveryOptions: {
        serviceId: { type: number };
        transportType: { type: number };
        shipmentOrderId: string;
        shipmentFee: number;
        shipmentFeeForCustomer: number;
        shipmentFeeByTotal: boolean;
        discount: number;
        discountBy: { type: number };
        feeForReceiver: number;
        moneyForSender: number;
        customerNote: string;
        noteForCustomerCare: string;
        noteForDelivery: string;
        transportStatus: string;
        transportLogs: [
            {
                _id: false;
                status: string;
                updatedAt: string;
            }
        ];
    };
}
