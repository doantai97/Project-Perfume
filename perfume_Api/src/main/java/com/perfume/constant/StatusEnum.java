package com.perfume.constant;

public enum StatusEnum {
    ACTIVE(1),
    DELETED(0),
    TEST(3);

    private final int value;

    private StatusEnum(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
