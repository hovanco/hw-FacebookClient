const getFee = (order: any) => {
    const price_list_product = order.products.reduce(
        (number: number, d: any) => number + d.count * d.price,
        0
    );

    const price_chiet_khau = (price: number) => {
        const { discount, discountBy } = order.deliveryOptions;

        if (!discount || typeof discountBy === 'undefined') {
            return 0;
        }

        if (discountBy === 1) {
            return (price * discount) / 100;
        }
        return discount;
    };

    const shipmentFeeTransport = order.deliveryOptions.shipmentFee
        ? order.deliveryOptions.shipmentFee
        : 0;

    const shipmentFeeForCustomer =
        order.deliveryOptions.shipmentFeeForCustomer || shipmentFeeTransport;

    const shipmentFee = shipmentFeeForCustomer;

    const discount = price_chiet_khau(price_list_product);

    const moneyForSender =
        price_list_product + shipmentFeeForCustomer - shipmentFeeTransport - discount;

    const feeForReceiver = price_list_product + shipmentFee - discount;

    return {
        moneyForSender,
        feeForReceiver,
    };
};

const getTotalPrice = (order: any) => {
    const price_list_product = order.products.reduce(
        (number: number, d: any) => number + d.count * d.price,
        0
    );

    const price_chiet_khau = (price: number) => {
        const { discount, discountBy } = order.deliveryOptions;
        if (discountBy === 1) {
            return (price * discount) / 100;
        }
        return discount;
    };

    const discount = price_chiet_khau(price_list_product);

    return price_list_product + order.deliveryOptions.shipmentFeeForCustomer - discount;
};

export { getFee, getTotalPrice };
