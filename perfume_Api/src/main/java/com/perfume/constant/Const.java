package com.perfume.constant;

import org.springframework.beans.factory.annotation.Value;

import java.text.SimpleDateFormat;

public class Const {
    public static final String formatDate = "dd/MM/yyyy hh:mm:ss";

    private static SimpleDateFormat simpleDateFormat = new SimpleDateFormat(formatDate);


    public static SimpleDateFormat getSimpleDateFormat() {
        return simpleDateFormat;
    }
}
