package com.perfume.entity;

import com.nmhung.anotation.QueryField;
import com.nmhung.anotation.TableName;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.util.List;

@Data
@Entity
@EqualsAndHashCode(callSuper = true)
@TableName
public class Checkout extends BaseEntity {
    @ManyToOne
    @QueryField(name = "user.id")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "coupon_id")
    private Coupon coupon;

    @OneToMany(mappedBy = "checkout", cascade = CascadeType.PERSIST)
    private List<CheckoutItem> checkoutItems;

    @Column
    @QueryField
    private Integer paymentMethod;

    @Column
    @QueryField
    private String address;

    @Column
    @QueryField
    private String email;

    @QueryField
    @Column
    String phone;

    @Column
    @QueryField
    private Integer provinceId;

    @Column
    @QueryField
    private Integer districtId;

    @Column
    @QueryField
    private Integer wardId;

    @Column
    @Lob
    @QueryField
    private String note;

    @Column
    private String firstname;

    @Column
    private String lastname;

    @Column
    private String total;

    @Column
    private String finalprice;

    public String description;

    @Transient
    private String search;

    @Transient
    private Boolean isCoupon;


    public Checkout() {
    }

    public Checkout(User user, Coupon coupon, List<CheckoutItem> checkoutItems) {
        this.user = user;
        this.coupon = coupon;
        this.checkoutItems = checkoutItems;
    }
}
