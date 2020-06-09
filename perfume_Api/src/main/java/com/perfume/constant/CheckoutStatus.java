package com.perfume.constant;

public enum CheckoutStatus {
    ACTIVE(1),
    DELETED(0),
    DELIVERY(2),
    DONE(3);

    private final int value;

    private CheckoutStatus(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    @Override
    public String toString() {
        String rs = "Hủy đơn";
        if (this.value == 1) {
            rs = " Tạo đơn ";
        } else if (value == 2) {
            rs = " Vận chuyển";
        } else if (value == 3) {
            rs = " Hoàn Thàng";

        }
        return rs;
    }

    public static CheckoutStatus getCheckoutStatus(int value) {
        for (CheckoutStatus checkoutStatus : values()) {
            if (checkoutStatus.value == value) {
                return checkoutStatus;
            }
        }
        return null;
    }
}
