package com.perfume.constant;

public enum TargetEnum {
    MALE("Nam"),
    FEMALE("Nữ"),
    GAY("GAY"),
    LES("LES"),
    CAR("Ô tô");

    private final String value;

    public String getValue() {
        return value;
    }

    TargetEnum(String value) {
        this.value = value;
    }
}
