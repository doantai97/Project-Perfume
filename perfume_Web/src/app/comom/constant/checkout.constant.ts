export const CHECKOUT_STATUS = {
    DELETED: 0,
    ACTIVE: 1,
    DELIVERY: 2,
    DONE: 3,
    ALL: -1
};


export const CHECKOUT_ACCTION = {
    DELETED: 'deleted',
    ACTIVE: 'active',
    DELIVERY: 'delivery',
    DONE: 'done',
    ALL: 'all'
};


export const CHECKOUT_STATUS_SELECT = [
    {
        label: 'Hủy',
        value: 0
    },
    {
        label: 'Mới',
        value: 1
    },
    {
        label: 'Vận chuyển',
        value: 2
    },
    {
        label: 'Hoàn thành',
        value: 3
    }
];

export const PAYMENT_METHOD = {
    COD: {
        label: 'Thanh toán khi giao hàng',
        value: 0
    },
    PAYPAL: {
        label: 'Paypal',
        value: 1
    }
};
