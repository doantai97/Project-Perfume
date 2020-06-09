package com.perfume.dto;

import lombok.Data;

import java.util.List;

@Data
public class CheckoutDTO extends BaseDTO {
    private UserDTO user;

    private CouponDTO coupon;

    private List<CheckoutItemDTO> checkoutItems;

    private String firstname;

    private String lastname;

    private String total;

    private String finalprice;

    private Integer paymentMethod;

    private String address;

    private String email;

    private String phone;

    private Integer provinceId;

    private Integer districtId;

    public String description;

    private Integer wardId;
    private String note;
    private Integer status;
}
