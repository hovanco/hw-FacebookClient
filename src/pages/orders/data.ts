const dataStatus = {
    0: { status: 'NEW', title: 'Mới', id: 0 },
    1: { status: 'CONFIRMED', title: 'Đã xác nhận', id: 1 },
    2: { status: 'WRAPPED', title: 'Đã đóng gói', id: 2 },
    3: { status: 'DELIVERING', title: 'Đang vận chuyển', id: 3 },
    4: { status: 'CANCELED', title: 'Đã hủy', id: 4 },
    5: { status: 'PAID', title: 'Đã thanh toán', id: 5 },
    6: { status: 'RETURNED', title: 'Trả hàng', id: 6 },
};

const statusDeliveryGhn = {
    ready_to_pick: { status: 'ready_to_pick', title: 'Đã tạo đơn' },
    picking: { status: 'picking', title: 'Đang tiếp nhận' },
    cancel: { status: 'cancel', title: 'Hủy đơn hàng' },
    money_collect_picking: { status: 'money_collect_picking', title: '' },
    picked: { status: 'picked', title: 'Đã tiếp nhận' },
    storing: { status: 'storing', title: 'Đã lấy hàng/Đã nhập kho' },
    transporting: { status: 'transporting', title: 'Đang vận chuyển' },
    sorting: { status: 'sorting', title: 'Đang phân loại' },
    delivering: { status: 'delivering', title: 'Đang giao hàng' },
    money_collect_delivering: { status: 'money_collect_delivering', title: '' },
    delivered: { status: 'delivered', title: 'Đã giao hàng' },
    delivery_fail: { status: 'delivery_fail', title: 'Không giao được hàng' },
    waiting_to_return: { status: 'waiting_to_return', title: 'Chờ giao hàng' },
    return: { status: 'return', title: 'Trả hàng' },
    return_transporting: { status: 'return_transporting', title: 'Đang vận chuyển trả hàng' },
    return_sorting: { status: 'return_sorting', title: 'Phân loại trả hàng' },
    returning: { status: 'returning', title: 'Đang trả hàng' },
    return_fail: { status: 'return_fail', title: 'Chưa trả được hàng' },
    returned: { status: 'returned', title: 'Đã trả hàng' },
    exception: { status: 'exception', title: 'Ngoại lệ' },
    damage: { status: 'damage', title: 'Hư hại' },
    lost: { status: 'lost', title: 'Thất lạc' },
};

const statusDeliveryGhtk = {
    '-1': { status: -1, title: 'Hủy đơn hàng' },
    '1': { status: 1, title: 'Chưa tiếp nhận' },
    '2': { status: 2, title: 'Đã tiếp nhận' },
    '3': { status: 3, title: 'Đã lấy hàng/Đã nhập kho' },
    '4': { status: 4, title: 'Đã điều phối giao hàng/Đang giao hàng' },
    '5': { status: 5, title: 'Đã giao hàng/Chưa đối soát' },
    '6': { status: 6, title: 'Đã đối soát' },
    '7': { status: 7, title: 'Không lấy được hàng' },
    '8': { status: 8, title: 'Hoãn lấy hàng' },
    '9': { status: 9, title: 'Không giao được hàng' },
    '10': { status: 10, title: 'Delay giao hàng' },
    '11': { status: 11, title: 'Đã đối soát công nợ trả hàng' },
    '12': { status: 12, title: 'Đã điều phối lấy hàng/Đang lấy hàng' },
    '13': { status: 13, title: 'Đơn hàng bồi hoàn' },
    '14': { status: 14, title: 'Đang trả hàng (COD cầm hàng đi trả)' },
    '15': { status: 15, title: 'Đã trả hàng (COD đã trả xong hàng)' },
};

const statusDelivery = {
    ...statusDeliveryGhn,
    ...statusDeliveryGhtk,
};

export { dataStatus, statusDelivery };
